import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
import { paginateResults, formatPagination } from '../utils/helpers.js';

export const getProducts = async (req, res) => {
    try {
        const { categoria_codigo, search, estado = 'A', page = 1, limit = 10, sort = 'descripcion', order = 'asc' } = req.query;

        // Build query
        const query = { estado };
        if (categoria_codigo) query.categoria_codigo = categoria_codigo;
        if (search) {
            query.$or = [
                { descripcion: { $regex: search, $options: 'i' } },
                { codigo: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const { skip, limit: limitNumber } = paginateResults(page, limit);

        // Get total count
        const total = await Product.countDocuments(query);

        // Get products with pagination and sorting
        const products = await Product.find(query)
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limitNumber);

        res.json({
            data: products,
            pagination: formatPagination(total, page, limit)
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category_id', 'name')
            .populate('subcategory_id', 'name');

        if (!product) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Product not found',
                status: 404
            });
        }

        // Get stock information
        const stock = await Stock.findOne({ product_id: product._id });

        res.json({
            ...product.toJSON(),
            stock: stock ? {
                physical: stock.physical_stock,
                committed: stock.committed_stock
            } : null
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { initial_stock, ...productData } = req.body;

        // Check if code already exists
        const existingProduct = await Product.findOne({ codigo: productData.codigo });
        if (existingProduct) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Product code already exists',
                status: 400
            });
        }

        // Create product
        const product = new Product(productData);
        await product.save();

        // Create initial stock if provided
        if (initial_stock) {
            const stock = new Stock({
                producto_codigo: product.codigo,
                stock_fisico: initial_stock,
                stock_comprometido: 0
            });
            await stock.save();
        }

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { codigo } = req.params;
        const updateData = req.body;

        // Verificar si el producto existe
        const product = await Product.findOne({ codigo });
        if (!product) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Product not found',
                status: 404
            });
        }

        // Si se está actualizando el código, verificar que no exista
        if (updateData.codigo && updateData.codigo !== codigo) {
            const existingProduct = await Product.findOne({ codigo: updateData.codigo });
            if (existingProduct) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Product code already exists',
                    status: 400
                });
            }
        }

        // Actualizar el producto
        const updatedProduct = await Product.findOneAndUpdate(
            { codigo },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { codigo } = req.params;

        const product = await Product.findOneAndUpdate(
            { codigo },
            { estado: 'I' },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Product not found',
                status: 404
            });
        }

        res.json({
            codigo: product.codigo,
            estado: product.estado,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
}; 