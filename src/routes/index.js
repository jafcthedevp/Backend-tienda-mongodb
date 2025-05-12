import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import stockRoutes from './stockRoutes.js';
import inventoryMovementRoutes from './inventoryMovementRoutes.js';
import companyRoutes from './companyRoutes.js';
import customerRoutes from './customerRoutes.js';
import priceRoutes from './priceRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/stocks', stockRoutes);
router.use('/inventory-movements', inventoryMovementRoutes);
router.use('/companies', companyRoutes);
router.use('/customers', customerRoutes);
router.use('/prices', priceRoutes);

export default router; 