import Category from '../models/Category.js';
import { paginateResults, formatPagination } from '../utils/helpers.js';

export const getCategories = async (req, res) => {
  try {
    const { tipo } = req.query;
    const query = tipo ? { tipo } : {};
    
    const categories = await Category.find(query);
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { codigo } = req.params;
    const category = await Category.findOne({ codigo });
    
    if (!category) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found',
        status: 404
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { codigo, tipo, descripcion, imagen_url, estado } = req.body;

    // Verificar si ya existe una categoría con el mismo código
    const existingCategory = await Category.findOne({ codigo });
    if (existingCategory) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Category with this code already exists',
        status: 400
      });
    }

    const category = new Category({
      codigo,
      tipo,
      descripcion,
      imagen_url,
      estado
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { tipo, descripcion, imagen_url, estado } = req.body;

    const category = await Category.findOne({ codigo });
    if (!category) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found',
        status: 404
      });
    }

    // Actualizar solo los campos proporcionados
    if (tipo) category.tipo = tipo;
    if (descripcion) category.descripcion = descripcion;
    if (imagen_url) category.imagen_url = imagen_url;
    if (estado) category.estado = estado;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { codigo } = req.params;
    const category = await Category.findOne({ codigo });

    if (!category) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Category not found',
        status: 404
      });
    }

    await category.deleteOne();

    res.json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
}; 