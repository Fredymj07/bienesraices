import express from 'express';
import { 
    formLogin,
    formRegister,
    createAccount,
    accountVerification,
    formForgotPassword,
    resetPassword,
    verifyTokenToResetPassword,
    assignNewPassword
} from '../controllers/userController.js';

const router = express.Router();

/**
 * Definición de las rutas de la aplicación
 */
router.get('/login', formLogin);

router.get('/register', formRegister);
router.post('/register', createAccount);

router.get('/mail-confirmation/:token', accountVerification);

router.get('/forgot-password', formForgotPassword);
router.post('/forgot-password', resetPassword);
router.get('/forgot-password/:token', verifyTokenToResetPassword);
router.post('/forgot-password/:token', assignNewPassword);

export default router;