import express from 'express';
import { 
    getCompanies, 
    getCompany, 
    createCompany, 
    updateCompany, 
    deleteCompany 
} from '../controllers/companyController.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (requieren solo autenticación)
router.get('/', getCompanies);
router.get('/:codigo', getCompany);

// Rutas de administrador
router.post('/', adminAuth, validate(schemas.company.create), createCompany);
router.put('/:codigo', adminAuth, validate(schemas.company.update), updateCompany);
router.delete('/:codigo', adminAuth, deleteCompany);

export default router; 