import InventoryMovement from '../models/InventoryMovement.js';
import Stock from '../models/Stock.js';
import Product from '../models/Product.js';

export const createMovement = async (req, res) => {
  try {
    const { 
      codigo_transaccion, 
      signo, 
      producto_codigo, 
      unidad_venta, 
      cantidad 
    } = req.body;

    // Verificar si el producto existe
    const product = await Product.findOne({ codigo: producto_codigo });
    if (!product) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Product not found',
        status: 404
      });
    }

    // Crear el movimiento
    const movement = new InventoryMovement({
      codigo_transaccion,
      signo,
      producto_codigo,
      unidad_venta,
      cantidad,
      estado: 'A'
    });

    await movement.save();

    // Actualizar el stock
    let stock = await Stock.findOne({ producto_codigo });
    if (!stock) {
      stock = new Stock({ producto_codigo });
    }

    // Actualizar el stock según el signo
    if (signo === '+') {
      stock.stock_fisico += cantidad;
    } else {
      stock.stock_fisico -= cantidad;
    }

    await stock.save();

    res.status(201).json({
      movement,
      stock: {
        producto_codigo: stock.producto_codigo,
        stock_fisico: stock.stock_fisico,
        stock_comprometido: stock.stock_comprometido,
        available_stock: stock.stock_fisico - stock.stock_comprometido
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

export const getMovements = async (req, res) => {
  try {
    const { producto_codigo, codigo_transaccion, estado } = req.query;
    const query = {};

    if (producto_codigo) query.producto_codigo = producto_codigo;
    if (codigo_transaccion) query.codigo_transaccion = codigo_transaccion;
    if (estado) query.estado = estado;

    const movements = await InventoryMovement.find(query)
      .sort({ fecha: -1 });

    res.json(movements);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const getMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const movement = await InventoryMovement.findById(id);

    if (!movement) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Movement not found',
        status: 404
      });
    }

    res.json(movement);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
};

export const updateMovementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const movement = await InventoryMovement.findById(id);
    if (!movement) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Movement not found',
        status: 404
      });
    }

    // Si el estado actual es diferente al nuevo estado
    if (movement.estado !== estado) {
      // Actualizar el stock según el cambio de estado
      const stock = await Stock.findOne({ producto_codigo: movement.producto_codigo });
      if (stock) {
        if (estado === 'I' && movement.estado === 'A') {
          // Si se está inactivando, revertir el movimiento
          stock.stock_fisico += (movement.signo === '+' ? -movement.cantidad : movement.cantidad);
        } else if (estado === 'A' && movement.estado === 'I') {
          // Si se está activando, aplicar el movimiento
          stock.stock_fisico += (movement.signo === '+' ? movement.cantidad : -movement.cantidad);
        }
        await stock.save();
      }
    }

    movement.estado = estado;
    await movement.save();

    res.json(movement);
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
}; 