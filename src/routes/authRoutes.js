import express from 'express';
import { register, login, updateUserRole, getUser, updateRoleNoAuth } from '../controllers/authController.js';
import { validate, schemas } from '../middleware/validation.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(schemas.auth.register), register);
router.post('/login', validate(schemas.auth.login), login);
router.get('/user/:userId', auth, getUser);
router.patch('/update-role/:userId', auth, adminAuth, updateUserRole);
router.patch('/update-role-no-auth/:userId', updateRoleNoAuth);

export default router;