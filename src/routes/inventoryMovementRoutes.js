import express from 'express';
import { 
    createMovement, 
    getMovements, 
    getMovement, 
    updateMovementStatus 
} from '../controllers/inventoryMovementController.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (requieren solo autenticación)
router.get('/', getMovements);
router.get('/:id', getMovement);

// Rutas de administrador
router.post('/', adminAuth, validate(schemas.inventoryMovement.create), createMovement);
router.patch('/:id/status', adminAuth, validate(schemas.inventoryMovement.updateStatus), updateMovementStatus);

export default router; 