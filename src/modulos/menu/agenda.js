const mysql   = require('mysql2/promise');
const express = require('express');
const router  = express.Router();

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




router.post('/grabaragenda', (req, res) => {
   
    grabar_evento_agenda(req).then(resultados => {
        if (resultados) {
          console.log(resultados);
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Nuevo evento registrado."
          });

        } else {
            res.status(404).json({
                status: 404,
                message: "Error en agregar evento."
            });
        }
      });
 });

 router.post('/actualizaragenda', (req, res) => {
   
    actualizar_evento_agenda(req).then(resultados => {
        if (resultados) {
          console.log(resultados);
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Evento actualizado."
          });

        } else {
            res.status(404).json({
                status: 404,
                message: "Error en actualizar evento."
            });
        }
      });
 });

 router.get('/getobteneragenda', (req, res) => {
   
    obtener_agenda(req).then(resultados => {
        if (resultados) {
          console.log(resultados);
          res.status(200).json({
            eventos: resultados, // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Consulta realizada."
          });

        } else {
            res.status(404).json({
                status: 404,
                message: "Error en consultar eventos."
            });
        }
      });
 });

 async function obtener_agenda(req) {
    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      const resultado = await connection.execute("SELECT nameevent as title, hourevent as hour, statusevent as state FROM eventos");
      const [rows] = resultado;
      if (rows.length === 0) {
      console.log('No hay EVENTOS!!.');
      return null;
      }
      const resultados = rows;
        return resultados; 
        } catch (error) {
            console.error('Error en la consulta:', error);
            return null; 
        } finally {
            if (connection) {
            connection.release();
            }
        }
  }


 async function grabar_evento_agenda(req) {
    let connection;
    try {
          connection = await pool.getConnection(); // Obtener una conexión del pool
          const { categoryevent, nameevent, typeevent, dayevent,hourevent, userevent, needevent , statusevent } = req.body;
          console.log('grabar_evento_agenda:', req.body); //Parametros de entrada del body
  
          const resultado = await connection.execute(
            'INSERT INTO eventos (categoryevent, nameevent, typeevent, dayevent,hourevent,userevent, needevent, statusevent )' + 
            'VALUES (?,?,?,?,?,?,?,?)',[categoryevent, nameevent, typeevent, dayevent,hourevent, userevent, needevent, statusevent ]);
  
          const [rows] = resultado;
          if (rows.length === 0) {
            console.log('Grabado evento agenda!!.');
            return null;
          }
  
          const resultados = rows;
          return resultados; 
  
          } catch (error) {
            console.error('Error en grabar evento en agenda :', error);
            return null; // En caso de error, retornamos null
      
          } finally {
            // Asegurarse de liberar la conexión de vuelta al pool
            if (connection) {
              connection.release();
            }
        }
  }

  async function actualizar_evento_agenda(req) {
    let connection;
    try {
          connection = await pool.getConnection(); // Obtener una conexión del pool
          const { idevent, status } = req.body;
          console.log('actualizar_evento_agenda:', req.body); //Parametros de entrada del body

          const query = 'UPDATE eventos SET statusevent = ? WHERE idevent = ?;';

          // Ejecutar la consulta
          const resultado = await connection.execute(query, [status, idevent]);
          const [rows] = resultado;

          if (rows.length === 0) {
            console.log('Evento actualizado.');
            return null;
          }
          const resultados = rows;
          return resultados; 
  
          } catch (error) {
            console.error('Error al actualizar evento: ', error);
            return null; // En caso de error, retornamos null
          } finally {
            // Asegurarse de liberar la conexión de vuelta al pool
            if (connection) {
              connection.release();
            }
        }
  }
  module.exports = router;