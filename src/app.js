const express = require('express');
const config  = require('./config');

//const clientes = require('./modulos/clientes/rutas');
const usuarios = require('./modulos/usuarios/usuarios');
const cliente = require('./database/connectionconfig');
const pagos = require('./modulos/menu/pagos');
const app = express();

//agregando a un puerto a mi apliacion app
app.set('port', config.app.port);

//rutas api
app.use('/api/usuarios',usuarios);
app.use(express.json()); // Middleware para procesar JSON


app.post('/login', usuarios);
app.post('/postpago', pagos);
app.use('/api/pagos', pagos);

/*
app.post('/login', (req, res) => {
    const { username, password } = req.body; // req.body contiene el objeto enviado
    // Lógica de autenticación
    if (username === 'admin' && password === '1234') {
      res.status(200).json({ mensaje: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
*/
module.exports = app;