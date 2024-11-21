/* eslint-disable no-undef */
import nodemailer from 'nodemailer';

const accountConfirmationEmail = async (data) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true, // Activa logs detallados
            debug: true  // Activa logs de depuración
        });
        
        const { name, email, token } = data;
    
        // Envío del email al usuario que se ha registrado en la aplicación
        await transport.sendMail({
            from: '"Bienes Raíces NodeJS" <no-reply@bienesraices.com>',
            to: email,
            subject: 'Instrucciones de confirmación para la cuenta en Bienes Raíces NodeJS',
            text: 'Confirmación para la cuenta en Bienes Raíces NodeJS',
            html: `
                <p>Bienvenid@ ${name}! <br>
                Gracias por registrarte en Bienes Raíces NodeJS. <br>
                Verifica tu email haciendo clic en el siguiente botón. <br>
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/mail-confirmation/${token}">Confirmar cuenta</a>
                </p>
                <p>Si no creaste esta cuenta, por favor ignora este mensaje.</p>
                <br>
                <br>
                <br>
                <p>Atentamente</p> <br>
                <p>Equipo Bienes Raíces NodeJS</p>
            `
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo');
    }
};

const forgotPasswordEmail = async (data) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            logger: true, // Activa logs detallados
            debug: true  // Activa logs de depuración
        });
        
        const { name, email, token } = data;
    
        // Envío del email al usuario que se ha registrado en la aplicación
        await transport.sendMail({
            from: '"Bienes Raíces NodeJS" <no-reply@bienesraices.com>',
            to: email,
            subject: 'Instrucciones actulización contraseña para la cuenta en Bienes Raíces NodeJS',
            text: 'Actualización contraseña para la cuenta en Bienes Raíces NodeJS',
            html: `
                <p>Hola ${name}! <br>
                Hemos evidenciado que deseas restablecer tu contraseña. <br>
                Haz clic en el siguiente botón para realizar el proceso. <br>
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Restablecer constraseña</a>
                </p>
                <p>Si no solicitaste el restablecimiento de tu contraseña o no tienes cuenta en Bienes Raíces NodeJS, por favor ignora este mensaje.</p>
                <br>
                <br>
                <br>
                <p>Atentamente</p> <br>
                <p>Equipo Bienes Raíces NodeJS</p>
            `
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo');
    }
};

export { 
    accountConfirmationEmail,
    forgotPasswordEmail
};
