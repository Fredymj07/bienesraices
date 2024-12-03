import express from 'express';
import {
    admin,
    create
} from '../controllers/propertyController.js';

const router = express.Router();

/**
 * Definición de las rutas correspondientes a PROPERTY
 */
router.get('/property', admin);
router.get('/property/create', create);

export default router;