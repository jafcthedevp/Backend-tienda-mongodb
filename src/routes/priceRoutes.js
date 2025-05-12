import express from 'express';
import { bulkUpdatePrices } from '../controllers/priceController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// PUT /api/prices/bulk-update - Actualización masiva de precios
router.put('/bulk-update', bulkUpdatePrices);

export default router; 