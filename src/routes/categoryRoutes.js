import express from 'express';
import { 
    getCategories, 
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from '../controllers/categoryController.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas públicas (requieren solo autenticación)
router.get('/', getCategories);
router.get('/:codigo', getCategory);

// Rutas de administrador
router.post('/', adminAuth, validate(schemas.category.create), createCategory);
router.put('/:codigo', adminAuth, validate(schemas.category.update), updateCategory);
router.delete('/:codigo', adminAuth, deleteCategory);

export default router; 