import User from '../models/User.js';
import { generateToken } from '../utils/helpers.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'User with this email or username already exists',
                status: 400
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            created_at: user.createdAt,
            token
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: 'Authentication error',
                message: 'Invalid credentials',
                status: 401
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Authentication error',
                message: 'Invalid credentials',
                status: 401
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'User not found',
                status: 404
            });
        }

        user.role = 'ADMIN';
        await user.save();

        res.json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'User not found',
                status: 404
            });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const updateRoleNoAuth = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'Not found',
                message: 'User not found',
                status: 404
            });
        }

        user.role = 'ADMIN';
        await user.save();

        res.json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
}; 