import express from 'express';
import { 
    formLogin,
    formRegister,
    createAccount,
    formForgotPassword 
} from '../controllers/userController.js';

const router = express.Router();

/* Rutas de la aplicación */
router.get('/login', formLogin);
router.get('/register', formRegister);
router.post('/register', createAccount);
router.get('/forgot-password', formForgotPassword);

export default router;