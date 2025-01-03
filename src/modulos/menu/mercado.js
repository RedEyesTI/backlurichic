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

router.post('/grabaritemmercado', (req, res) => {
   
    grabar_item_mercado(req).then(resultados => {
        if (resultados) {
          console.log('entro');
          console.log(resultados);
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Item añadido de forma exitosa."
          });

        } else {
            res.status(404).json({
               
                status: 404,
                message: "Error en agregar item."
            });
        }
      });
 }) ;

 router.post('/updateitemmercado', (req, res) => {
   
    actualizar_item_mercado(req).then(resultados => {
        if (resultados) {
          console.log('entro');
          console.log(resultados);
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Item actualizado de forma exitosa."
          });

        } else {
            res.status(404).json({
                status: 404,
                message: "Error en actualizar item."
            });
        }
      });
 }) ;

 router.get('/obteneritemsmercado', (req, res) => {
   
  obteneritemsmercado().then(resultados => {
      if (resultados) {
        console.log('invoca servicio obtener items de mercado');
        res.status(200).json({
          ...resultados[0], // Si es un array, devuelve el primer objeto
          status: 200,
          message: "Items ok"
        });

      } else {
          res.status(404).json({            
              status: 404,
              message: "Error en Consulta."
          });
      }
    });
});

async function obteneritemsmercado() {
  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();
    const resultado = await connection.execute('SELECT * FROM mercado' );

    const [rows] = resultado;

  // Verificar si hay resultados
  if (rows.length === 0) {
    console.log('No hay mercado!!.');
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


 async function grabar_item_mercado(req) {
    let connection;
    try {
          connection = await pool.getConnection(); // Obtener una conexión del pool
          const { categoryitem, nameitem,  statusitem, useritem } = req.body;
          console.log('body_grabaritem_mercado:', req.body); //Parametros de entrada del body
  
          const resultado = await connection.execute(
            'INSERT INTO mercado (categoryitem, nameitem, statusitem, useritem)' + 
            'VALUES (?,?,?,?)',[categoryitem, nameitem,  statusitem, useritem]);
  
          const [rows] = resultado;
          if (rows.length === 0) {
            console.log('Grabado ok grabar item mercado!!.');
            return null;
          }
  
          const resultados = rows;
          return resultados; 
  
          } catch (error) {
            console.error('Error en grabar el item mercado :', error);
            return null; // En caso de error, retornamos null
      
          } finally {
            // Asegurarse de liberar la conexión de vuelta al pool
            if (connection) {
              connection.release();
            }
        }
  }

  async function actualizar_item_mercado(req) {
    let connection;
    try {
          connection = await pool.getConnection(); // Obtener una conexión del pool
          const { iditem, status } = req.body;
          console.log('body_actualizar_item_mercado:', req.body); //Parametros de entrada del body

          const query = 'UPDATE mercado SET statusitem = ? WHERE iditem = ?;';

          // Ejecutar la consulta
          const resultado = await connection.execute(query, [status, iditem]);
          const [rows] = resultado;

          if (rows.length === 0) {
            console.log('Item actualizado.');
            return null;
          }
          const resultados = rows;
          return resultados; 
  
          } catch (error) {
            console.error('Error al actualizar item: ', error);
            return null; // En caso de error, retornamos null
          } finally {
            // Asegurarse de liberar la conexión de vuelta al pool
            if (connection) {
              connection.release();
            }
        }
  }
  module.exports = router;
  