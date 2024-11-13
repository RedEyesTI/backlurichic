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

router.post('/postpago', (req, res) => {
   
    ejecutarpago(req).then(resultados => {
        if (resultados) {
          console.log('entro');
          console.log(resultados);
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Pago exitoso."
          });

        } else {
            res.status(404).json({
               
                status: 404,
                message: "Error en Pago."
            });
        }
      });
  });

  async function ejecutarpago(req) {
    let connection;
    try {
          // Obtener una conexión del pool
          connection = await pool.getConnection();
          // colocamos los valores del body en los campos
          const { idservicio, descservotro,mes, anio,monto, comentarios} = req.body;
          // Realizar la consulta en la BD
          const resultado = await connection.execute(
            'INSERT INTO pagos (idservicio, descservotro,mes, anio,monto, comentarios)' + 
            'VALUES (?,?,?,?,?,?)',[ idservicio, descservotro,mes, anio,monto, comentarios]);
      
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
/*
`idoperacion` INT AUTO_INCREMENT NOT NULL,
`idservicio` VARCHAR(45) NULL,
`descservotro` VARCHAR(45) NULL,
`mes` VARCHAR(10) NULL, 
`anio` VARCHAR(4) NULL,
`monto` decimal(5,2) NULL,
`comentarios` VARCHAR(50) NULL,
*/