import express from 'express';

/* Instanciación de la aplicación */
const app = express();

/* Routing de la aplicación */
app.get('/', function(req, res) {
    res.send('Hello World using Express.')
});

app.get('/nosotros', function(req, res) {
    res.send('Information about us.')
});

/* Definición del puerto del servidor y arranque de la aplicación */
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});