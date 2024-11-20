import { check, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateId } from '../helpers/userTokens.js';
import { registrationEmail } from '../helpers/emails.js';

/**
 * Método que permite mostrar el formulario para realizar el login en la aplicación
 * @param {*} req 
 * @param {*} res 
 */
const formLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar sesión'
    });
}

/**
 * Método que permite mostrar el formulario para el registro de usuarios
 * @param {*} req 
 * @param {*} res 
 */
const formRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear cuenta',
        csrfToken: req.csrfToken()
    });
}

/**
 * Método que permite realizar el registro de un nuevo usuario
 * @param {*} req
 * @param {*} res
 * @returns usuario que ha sido creado luego de superar todas las validaciones
 */
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

    // Validación del resultado de las validaciones de los campos ingresados
    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear cuenta',
            csrfToken: req.csrfToken(),
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
            page: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'El email ingresado ya se encuentra registrado'}],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }

    // Almacenamiento del nuevo usuario
    try{
        const user = await User.create({
            name,
            email,
            password,
            token: generateId()
        });

        // Envío del email de confirmación
        registrationEmail({
            name: user.name,
            email: user.email,
            token: user.token
        });

        // Redireccionar al usuario y mostrar un mensaje de confirmación
        return res.render('templates/confirmation-message', {
            page: 'Confirmación',
            message: '¡Gracias por registrarte! \nConsulte el correo electrónico de confirmación en ' + email
        });
    } catch(error) {
        console.error('Error al crear el usuario:', error);
        return res.render('auth/register', {
            page: 'Crear cuenta',
            errors: [{ msg: 'Ocurrió un error al registrar al usuario. Inténtalo de nuevo.' }],
            user: {
                name: req.body.name,
                email: req.body.email
            }
        });
    }
    
}

/**
 * Método que permite realizar la verificación de una cuenta de correo
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const accountVerification = async (req, res) => {
    const { token } = req.params;

    try {
        // Confirmación de la valides del token del usuario
        const user = await User.findOne({ where: { token } });

        // Redireccionar al usuario y mostrar un mensaje cuando no existe el token
        if (!user) {
            return res.render('auth/confirm-account', {
                page: 'Error en confirmación de cuenta',
                error: true,
                message: 'Lo sentimos!!! <br>No ha sido posible realizar la confirmación de la cuenta. Intenta nuevamente.'
            });
        }

        // Confirmación de la cuenta del usuario
        user.token = null;
        user.confirmed = true;
        await user.save();

        return res.render('auth/confirm-account', {
            page: 'Confirmación exitosa de cuenta',
            message: 'Hola!!! <br>Bienvenid@ a tu cuenta en Bienes Raíces NodeJS.'
        });
    } catch (error) {
        console.error('Error al consultar el token del usuario:', error);
    }
}

/**
 * Método que permite mostrar el formulario para recuperar la contraseña
 * @param {*} req 
 * @param {*} res 
 */
const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Olvidé mi contraseña'
    });
}

const resetPassword = (req, res) => {
    console.log('Ingreso');
}

export {
    formLogin,
    formRegister,
    createAccount,
    accountVerification,
    formForgotPassword,
    resetPassword
}