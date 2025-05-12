import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

export const auth = async (req, res, next) => {
  try {
    console.log('=== Auth Middleware Debug ===');
    console.log('Request headers:', req.headers);
    console.log('Auth Header:', req.header('Authorization'));
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token after Bearer removal:', token);
    
    if (!token) {
      console.log('No token provided');
      throw new Error('No token provided');
    }

    console.log('JWT Secret:', config.jwtSecret);
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Decoded token:', decoded);
    
    const user = await User.findOne({ _id: decoded.id, status: 'A' });
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found or not active');
      throw new Error('User not found or not active');
    }

    req.token = token;
    req.user = user;
    console.log('=== Auth Successful ===');
    next();
  } catch (error) {
    console.error('Auth error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please authenticate to access this resource',
      status: 401
    });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      console.log('=== Admin Auth Check ===');
      console.log('User role:', req.user.role);
      if (req.user.role !== 'ADMIN') {
        console.log('User is not admin');
        throw new Error('User is not admin');
      }
      console.log('=== Admin Auth Successful ===');
      next();
    });
  } catch (error) {
    console.error('Admin auth error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required',
      status: 403
    });
  }
}; 