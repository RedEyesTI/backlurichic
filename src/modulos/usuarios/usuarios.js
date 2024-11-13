const mysql = require('mysql2/promise');
const express = require('express');
const router = express.Router();
// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  waitForConnections: true,  // Esperar conexiones si todas están ocupadas
  connectionLimit: 10,       // Límite máximo de conexiones en el pool
  queueLimit: 0              // Límite de conexiones en cola (0 = ilimitado)
});

router.post('/login', (req, res) => {
   
    ejecutarlogin(req).then(resultados => {
        if (resultados) {

          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Ingreso exitoso."
          });

        } else {
            res.status(404).json({
                status: 404,
                message: "Correo/Contraseña incorrecto."
            });
        }
      });
  });

async function ejecutarlogin(req) {
    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      // colocamos los valores del body en los campos
      const { correo, contrasena } = req.body;
      // Realizar la consulta en la BD
      const resultado = await connection.execute('SELECT * FROM usuarios where correo = "' + correo + '" and contrasena = ' + contrasena  );
  
      if (Array.isArray(resultado) && resultado.length > 0) {
        const [rows] = resultado;
  
        // Verificar si hay resultados
        if (rows.length === 0) {
          console.log('Credencial incorreta!!.');
          return null;
        }

        // Almacena resultado
        const resultados = rows;
        // Retorna los resultados para usarlos fuera de la función
        return resultados; 

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
  

module.exports = router;