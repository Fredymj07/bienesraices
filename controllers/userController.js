import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateId } from '../helpers/userTokens.js';
import { accountConfirmationEmail, forgotPasswordEmail } from '../helpers/emails.js';

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
    try{
        // Validación de los datos ingresados en el formulario
        await check('name').notEmpty().withMessage('El nombre es un campo requerido').run(req);
        await check('email').isEmail().withMessage('El valor ingresado no corresponde a un email').run(req);
        await check('password')
            .notEmpty()
            .withMessage('La contraseña no puede estar vacía')
            .bail() // Detiene la ejecución de validaciones adicionales si falla esta
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
        const user = await User.create({
            name,
            email,
            password,
            token: generateId()
        });

        // Definición de datos que serán enviados en el email al usuario
        accountConfirmationEmail({
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
            return res.render('auth/message-confirmation', {
                page: 'Error en confirmación de cuenta',
                error: true,
                message: 'Lo sentimos!!! <br>No ha sido posible realizar la confirmación de la cuenta. Intenta nuevamente.'
            });
        }

        // Confirmación de la cuenta del usuario
        user.token = null;
        user.confirmed = true;
        await user.save();

        return res.render('auth/message-confirmation', {
            page: 'Confirmación de cuenta exitosa',
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
        page: 'Recuperar mi contraseña',
        csrfToken: req.csrfToken()
    });
}

/**
 * Este método permite realizar la validación del email ingresado por el usuario para 
 * generar un token y enviar un email para reestablecer la contraseña
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const resetPassword = async (req, res) => {
    try {
        // Validación del email ingresado en el formulario
        await check('email').isEmail().withMessage('El valor ingresado no corresponde a un email').run(req);
        let result = validationResult(req);

        // Validación del resultado de las validaciones de los campos ingresados
        if (!result.isEmpty()) {
            return res.render('auth/forgot-password', {
                page: 'Recuperar mi contraseña',
                csrfToken: req.csrfToken(),
                errors: result.array()
            });
        }

        // Confirmación de la existencia del correo ingresado
        const { email } = req.body;        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('auth/forgot-password', {
                page: 'Recuperar mi contraseña',
                csrfToken: req.csrfToken(),
                errors: [{ msg: 'El email ingresado no se encuentra registrado. Verifica e intenta de nuevo.' }]
            });
        }

        // Generación de token para el envío del email y actualización de la contraseña
        user.token = generateId();
        await user.save();

        // Definición de datos que serán enviados en el email al usuario
        forgotPasswordEmail({
            email: user.email,
            name: user.name,
            token: user.token
        });

        // Redireccionar al usuario y mostrar un mensaje de confirmación
        return res.render('templates/confirmation-message', {
            page: 'Restablecimiento de contraseña',
            message: 'Hemos enviado un email con las instrucciones para reestablecer tu contraseña.'
        });
    } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        return res.render('auth/forgot-password', {
            page: 'Recuperar mi contraseña',
            errors: [{ msg: 'Ocurrió un error al restablecer la contraseña. Inténtalo nuevamente.' }]
        });
    }
}

/**
 * Este método permite realizar la validación del token del usuario para restablecer la contraseña
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const verifyTokenToResetPassword = async (req, res) => {
    try {
        // Confirmación de la valides del token del usuario
        const { token } = req.params;
        const user = await User.findOne({ where: { token } });

        // Redireccionar al usuario y mostrar un mensaje cuando no existe el token
        if (!user) {
            return res.render('auth/message-confirmation', {
                page: 'Restablecer contraseña',
                error: true,
                message: 'Lo sentimos!!! <br>No ha sido posible validar tu información. Intenta nuevamente.'
            });
        }

        // Mostrar formulario para cambiar la contraseña
        return res.render('auth/reset-password', {
            page: 'Restablecer contraseña',
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error('Error al consultar el token del usuario:', error);
    }
}

/**
 * Este método permite validar la nueva contraseña del usuario, encriptarla y guardarla en base de datos
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const assignNewPassword = async (req, res) => {
    try {
        // Validación de la contraseña ingresada en el formulario
        await check('password')
            .notEmpty()
            .withMessage('La contraseña no puede estar vacía')
            .bail() // Detiene la ejecución de validaciones adicionales si falla esta
            .isStrongPassword()
            .withMessage('La contraseña seleccionada no es segura')
            .run(req);
        
        // Validación de la existencia de errores de acuerdo con las validaciones
        let result = validationResult(req);

        if (!result.isEmpty()) {
            return res.render('auth/reset-password', {
                page: 'Restablecer contraseña',
                csrfToken: req.csrfToken(),
                errors: result.array()
            });
        }

        // Validación de un token válido para hacer el cambio de la contraseña
        const { token } = req.params;
        const { password } = req.body;
        
        // Búsqueda del usuario para hacer la modificación de la contraseña
        const user = await User.findOne({ where: { token } });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Actualización del token y de la contraseña para guardar en base de datos
        user.token = null;
        await user.save();

        res.render('auth/message-confirmation', {
            page: 'Contraseña restablecida',
            message: 'La contraseña ha sido modificada correctamente!'
        });
    } catch (error) {
        console.error('Error al restablecer la contraseña del usuario:', error);
    }
}

export {
    formLogin,
    formRegister,
    createAccount,
    accountVerification,
    formForgotPassword,
    resetPassword,
    verifyTokenToResetPassword,
    assignNewPassword
}