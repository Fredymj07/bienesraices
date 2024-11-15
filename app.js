import express from 'express';
import userRoutes from './routes/userRoutes.js';

/* Instanciación de la aplicación */
const app = express();

/* Routing */
app.use('/auth', userRoutes);

/* Habilitar Pug para Template Engine */
app.set('view engine', 'pug');
app.set('views', './views');

/* Definición del puerto del servidor y arranque de la aplicación */
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});