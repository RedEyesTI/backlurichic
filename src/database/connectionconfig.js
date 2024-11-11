const mysql = require('mysql2/promise');
const  express = require('express');
const router = express.Router();
// Crear el pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hunter',
  database: 'lurichichouse',
  waitForConnections: true,  // Esperar conexiones si todas están ocupadas
  connectionLimit: 10,       // Límite máximo de conexiones en el pool
  queueLimit: 0              // Límite de conexiones en cola (0 = ilimitado)
});

async function ejecutarConsulta() {
  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    console.log('Conexión exitosa a la base de datos');

    // Realizar la consulta
    const resultado = await connection.execute('SELECT * FROM usuarios');

    if (Array.isArray(resultado) && resultado.length > 0) {
      const [rows] = resultado;

      // Verificar si hay resultados
      if (rows.length === 0) {
        console.log('No hay resultados.');
        return null;
      }

      const resultados = rows;

      return resultados; // Retorna los resultados para usarlos fuera de la función
    } else {
      console.log('El resultado no es iterable o no contiene datos.');
      return null;
    }

  } catch (error) {
    console.error('Error en la consulta:', error);
    return null; // En caso de error, retornamos null
  } finally {
    // Asegurarse de liberar la conexión de vuelta al pool
    if (connection) {
      connection.release();
    }
  }
}

// Ejecutar la función

router.get('/', function(req,res){
    
    ejecutarConsulta().then(resultados => {
        if (resultados) {
          res.send(resultados)
          console.log('Constante con resultados fuera de la función:', resultados);
        } else {
          console.log('No se obtuvieron resultados.');
        }
      });
}
);

module.exports = router;