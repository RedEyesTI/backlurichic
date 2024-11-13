const app = require('./app');
const PORT = 5002;
/*
app.listen(app.get('port'),() => {
    console.log("Servidor escuchando el puerto", app.get("port"));
})
*/
app.listen(PORT,() => {
    console.log("Servidor escuchando el puerto", PORT);
})
