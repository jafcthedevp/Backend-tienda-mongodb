import Product from '../models/Product.js';

export const bulkUpdatePrices = async (req, res) => {
  try {
    const { percentage, category_id, apply_to_all = false } = req.body;

    // Validar el porcentaje
    if (!percentage || isNaN(percentage)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Percentage must be a valid number',
        status: 400
      });
    }

    // Convertir el porcentaje a decimal (ej: 10% -> 0.1)
    const percentageDecimal = percentage / 100;

    // Construir el query base
    const query = { status: 'A' };
    
    // Si no es apply_to_all, se requiere category_id
    if (!apply_to_all) {
      if (!category_id) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Category ID is required when not applying to all products',
          status: 400
        });
      }
      query.category_id = category_id;
    }

    // Obtener los productos que se actualizarán
    const products = await Product.find(query);
    
    if (products.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'No active products found to update',
        status: 404
      });
    }

    // Actualizar los precios
    const updatePromises = products.map(product => {
      const newPrice = product.price * (1 + percentageDecimal);
      return Product.findByIdAndUpdate(
        product._id,
        { $set: { price: Number(newPrice.toFixed(2)) } },
        { new: true }
      );
    });

    const updatedProducts = await Promise.all(updatePromises);

    res.json({
      message: `Successfully updated prices for ${updatedProducts.length} products`,
      percentage_applied: percentage,
      updated_products: updatedProducts.map(product => ({
        id: product._id,
        name: product.name,
        old_price: product.price / (1 + percentageDecimal),
        new_price: product.price
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      status: 500
    });
  }
}; 