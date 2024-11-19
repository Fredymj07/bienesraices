import { check, validationResult } from 'express-validator';
import User from '../models/User.js';

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Login'
    });
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Create account'
    });
}

const createAccount = async (req, res) => {
    // Validación de los datos ingresados en el formulario
    await check('name').notEmpty().withMessage('El nombre es un campo requerido').run(req);
    await check('email').isEmail().withMessage('El valor ingresado no corresponde a un email').run(req);
    await check('password')
        .isStrongPassword()
        .withMessage('La contraseña seleccionada no es segura')
        .run(req);
    await check('repeat_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no son iguales');
            }
            return true;
        })
        .run(req);
    
    let result = validationResult(req);
    console.log(result);

    // Validación del resultado de las validaciones de los campos ingresados
    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Create account',
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    // Extracción de los campos provenientes del req.body
    const { name, email, password } = req.body;

    // Verificación de la existencia de un usuario registrado
    const existUser = await User.findOne({ where: { email } });

    if (existUser) {
        return res.render('auth/register', {
            page: 'Create account',
            errors: [{msg: 'El email ingresado ya se encuentra registrado'}],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    // Almacenamiento del nuevo usuario
    try{
        await User.create({
            name,
            email,
            password,
            token: 123
        });

        // Redireccionar al usuario o mostrar un mensaje de éxito
        return res.redirect('/auth/login');
    } catch(error) {
        console.error('Error al crear el usuario:', error);
        return res.render('auth/register', {
            page: 'Create account',
            errors: [{ msg: 'Ocurrió un error al registrar al usuario. Inténtalo de nuevo.' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
    
}

const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Forgot password'
    });
}

export {
    formLogin,
    formRegister,
    createAccount,
    formForgotPassword
}