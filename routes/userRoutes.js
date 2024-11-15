import express from 'express';
import { formLogin, formRegister } from '../controllers/userController.js';

const router = express.Router();

/* Rutas de la aplicación */
router.get('/login', formLogin);
router.get('/register', formRegister);

export default router;