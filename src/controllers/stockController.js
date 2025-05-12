import Stock from '../models/Stock.js';
import Product from '../models/Product.js';

export const getStock = async (req, res) => {
  try {
    const { producto_codigo } = req.params;
    
    // Verificar si el producto existe
    const product = await Product.findOne({ codigo: producto_codigo });
    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found',
        status: 404
      });
    }

    // Buscar o crear el stock
    let stock = await Stock.findOne({ producto_codigo });
    if (!stock) {
      stock = new Stock({ producto_codigo });
      await stock.save();
    }

    // Incluir información del producto en la respuesta
    const response = {
      ...stock.toJSON(),
      producto: {
        codigo: product.codigo,
        descripcion: product.descripcion
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { producto_codigo } = req.params;
    const { stock_comprometido, stock_fisico } = req.body;

    // Verificar si el producto existe
    const product = await Product.findOne({ codigo: producto_codigo });
    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found',
        status: 404
      });
    }

    // Buscar o crear el stock
    let stock = await Stock.findOne({ producto_codigo });
    if (!stock) {
      stock = new Stock({ producto_codigo });
    }

    // Actualizar los valores
    if (stock_comprometido !== undefined) {
      stock.stock_comprometido = stock_comprometido;
    }
    if (stock_fisico !== undefined) {
      stock.stock_fisico = stock_fisico;
    }

    await stock.save();

    // Incluir información del producto en la respuesta
    const response = {
      ...stock.toJSON(),
      producto: {
        codigo: product.codigo,
        descripcion: product.descripcion
      }
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    
    // Obtener información de los productos para cada stock
    const stocksWithProducts = await Promise.all(
      stocks.map(async (stock) => {
        const product = await Product.findOne({ codigo: stock.producto_codigo });
        return {
          ...stock.toJSON(),
          producto: product ? {
            codigo: product.codigo,
            descripcion: product.descripcion
          } : null
        };
      })
    );

    res.json(stocksWithProducts);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
}; 