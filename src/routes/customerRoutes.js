import express from 'express';
import { 
    getCustomers, 
    getCustomer, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
} from '../controllers/customerController.js';
import { validateRequest } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(auth);

// Rutas públicas (requieren autenticación)
router.get('/', getCustomers);
router.get('/:codigo', getCustomer);

// Rutas de administrador (requieren rol ADMIN)
router.post('/', adminAuth, validateRequest('customer', 'create'), createCustomer);
router.put('/:codigo', adminAuth, validateRequest('customer', 'update'), updateCustomer);
router.delete('/:codigo', adminAuth, deleteCustomer);

export default router; 