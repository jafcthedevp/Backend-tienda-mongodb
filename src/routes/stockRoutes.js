import express from 'express';
import { getStock, updateStock, getAllStocks } from '../controllers/stockController.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (requieren solo autenticación)
router.get('/', getAllStocks);
router.get('/:producto_codigo', getStock);

// Rutas de administrador
router.put('/:producto_codigo', adminAuth, validate(schemas.stock.update), updateStock);

export default router; 