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

router.post('/grabarpago', (req, res) => {
   
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
 }) ;

 router.post('/quitarpago', (req, res) => {
  console.log('---------------------------');
  console.log('Inicio Servicio Quitar Pago');
  retirarpago(req).then(resultados => {
      if (resultados.affectedRows > 0 ) {
        console.log(resultados);

        res.status(200).json({          
          ...resultados[0], // Si es un array, devuelve el primer objeto
          status: 200,
          message: "Pago eliminado correctamente."
        });

      } 
            
      else {
          res.status(200).json({
             
              status: 200,
              message: "No se encontro registro de operacion."
          });
      }
    });
}) ;

  router.get('/getresumenpagos', (req, res) => {
   
    obtenerresumen().then(resultados => {
        if (resultados) {
          console.log('invoca servicio obtener resumen');
          res.status(200).json({
            ...resultados[0], // Si es un array, devuelve el primer objeto
            status: 200,
            message: "Resumen ok"
          });

        } else {
            res.status(404).json({            
                status: 404,
                message: "Error en Consulta."
            });
        }
      });
  });

  router.post('/getdetallepagos', (req, res) => {
   
    obtenerdetallepago(req).then(resultados => {
        if (resultados) {
          console.log('invoca servicio obtener detalle pago');
          res.status(200).json({
            pagos: resultados,  // Enviar 'resultados' como un array bajo la clave 'result'
            status: 200,
            message: "Resumen ok"
          });

        } else {
            res.status(404).json({            
                status: 404,
                message: "No se encontraton resultados"
            });
        }
      });
  });

  async function obtenerresumen() {
    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      // colocamos los valores del body en los campos
      //const { idservicio, descservotro,mes, anio,monto, comentarios} = req.body;
      // Realizar la consulta en la BD
      const resultado = await connection.execute('SELECT '+
                                                     'SUM(monto) as totalmonto, ' +
                                                     'COUNT(monto) as cantidadpagos,'+ 
                                                     "(SELECT SUM(monto) FROM pagos WHERE servicio = 'AHORROS' AND tipopago = 'FAMILIAR') AS ahorros " +
                                                     ' FROM pagos' );
  
      const [rows] = resultado;

    // Verificar si hay resultados
    if (rows.length === 0) {
      console.log('No hay pagos!!.');
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

  async function obtenerdetallepago(req) {
    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      // colocamos los valores del body en los campos
      const { anio,mes} = req.body;
      // Realizar la consulta en la BD
      const resultado = await connection.execute(
        "SELECT p.*,"+
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + ") AS suma_monto, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND servicio = 'AHORROS') AS ahorroTotal, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND servicio = 'AHORROS' AND usu_registro = 'Beatriz') AS ahorroBea, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND servicio = 'AHORROS' AND usu_registro = 'Jair') AS ahorroJair, " +

        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'FAMILIAR' AND servicio <> 'AHORROS') AS gastoFamiliarTotal, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'FAMILIAR' AND servicio <> 'AHORROS' AND usu_registro = 'Beatriz') AS gastoFamiliarBea, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'FAMILIAR' AND servicio <> 'AHORROS' AND usu_registro = 'Jair') AS gastoFamiliarJair, " +

        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'PERSONAL') AS gastoPersoTotal, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'PERSONAL' AND pagopersonal = 'Beatriz') AS gastoPersonalBea, " +
        "(SELECT SUM(monto) FROM pagos WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " AND tipopago = 'PERSONAL' AND pagopersonal = 'Jair') AS gastoPersonalJair " +



        " FROM pagos p WHERE YEAR(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + anio + " AND MONTH(STR_TO_DATE(fechapagoreal, '%d/%m/%Y')) = " + mes + " ORDER BY STR_TO_DATE(fechapagoreal, '%d/%m/%Y') DESC;"
      );
      const [rows] = resultado;

    // Verificar si hay resultados
    if (rows.length === 0) {
      console.log('No hay pagos!!.');
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

  async function ejecutarpago(req) {
    let connection;
    try {
          // Obtener una conexión del pool
          connection = await pool.getConnection();
          // colocamos los valores del body en los campos
          const { tipopago, pagopersonal, categoria, servicio, monto, comentarios, fechapagoreal, usu_registro} = req.body;
          console.log('Datos recibidos:', req.body);

          // Realizar la consulta en la BD
          const resultado = await connection.execute(
            'INSERT INTO pagos (tipopago, pagopersonal, categoria, servicio, monto, comentarios, fechapagoreal, usu_registro)' + 
            'VALUES (?,?,?,?,?,?,?,?)',[ tipopago, pagopersonal, categoria, servicio, monto, comentarios, fechapagoreal, usu_registro]);
      
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

async function retirarpago(req) {
  let connection;
  try {
        
        connection = await pool.getConnection(); // Obtener una conexión del pool
        const { idoperacion } = req.body;
        console.log('Datos recibidos:', idoperacion); //Parametros de entrada del body

        const resultado = await connection.execute('DELETE FROM pagos WHERE idoperacion = ' + idoperacion);
        //const resultado_consulta = await connection.execute('SELECT * FROM pagos WHERE idoperacion = ' + idoperacion);
        const [rows] = resultado;

        if (rows.length === 0) {
          console.log('Credencial incorreta!!.');
          return null;
        }
        else {
          if(rows.affectedRows > 0){
            console.log('Se elimina registro correctamente!!');
          }
          else{
            console.log('No se encontro registro!!');
          }
        }

        return rows; 

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
