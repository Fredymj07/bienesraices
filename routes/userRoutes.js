import express from 'express';
import { 
    formLogin,
    formRegister,
    formForgotPassword 
} from '../controllers/userController.js';

const router = express.Router();

/* Rutas de la aplicación */
router.get('/login', formLogin);
router.get('/register', formRegister);
router.get('/forgot-password', formForgotPassword);

export default router;