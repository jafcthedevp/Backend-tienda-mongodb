import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

export const paginateResults = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit };
};

export const formatPagination = (total, page, limit) => {
    const pages = Math.ceil(total / limit);
    return {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages
    };
};

export const handleError = (error, res) => {
    console.error(error);
    res.status(error.status || 500).json({
        error: error.name || 'Internal Server Error',
        message: error.message,
        status: error.status || 500,
        timestamp: new Date().toISOString()
    });
}; 