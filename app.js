import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';

/* Obtener el nombre de archivo actual y el directorio actual */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Instanciación de la aplicación */
const app = express();

 /* Conexión con la base de datos */
 try {
    await db.authenticate();
    console.log('Connection succesfull to Database!!!');
 } catch (error) {
    console.log(error);
 }

/* Configuración del directorio de archivos estáticos */
app.use(express.static(path.join(__dirname, 'public')));

/* Habilitar Pug para Template Engine */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* Routing */
app.use('/auth', userRoutes);

/* Definición del puerto del servidor y arranque de la aplicación */
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});