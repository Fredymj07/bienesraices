/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

const generateJWT = data => jwt.sign({
    // Información que se cifraría con jwt
    id: data.id,
    name: data.name

    // Secreto para la encripción de la información
}, process.env.SECRET_KEY, {

    // Tiempo de expiración del token
    expiresIn: '5m'
});
const generateUserToken = ()  => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generateJWT,
    generateUserToken
}