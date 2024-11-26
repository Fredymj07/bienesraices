/* eslint-disable no-undef */
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import db from './config/db.js';

/* Obtener el nombre de archivo actual y el directorio actual */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Instanciación de la aplicación */
const app = express();

/* Habilitar lectura de datos ingresados en formularios */
app.use( express.urlencoded({extended: true}) );

/* Habilitar cookie parser para la activación de CSRF */
app.use( cookieParser() );

/* Habilitar csurf para la seguridad en los formularios de la aplicación */
app.use( csrf({cookie: true}) );

/* Conexión con la base de datos */
try {
   await db.authenticate();
   db.sync();
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
app.use('/', propertyRoutes);

/* Definición del puerto del servidor y arranque de la aplicación */
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});