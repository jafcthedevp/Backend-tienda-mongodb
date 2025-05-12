import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  producto_codigo: {
    type: String,
    required: true,
    ref: 'Product'
  },
  stock_comprometido: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  stock_fisico: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índice para búsqueda rápida por producto_codigo
stockSchema.index({ producto_codigo: 1 });

// Virtual for available stock
stockSchema.virtual('available_stock').get(function() {
  return this.stock_fisico - this.stock_comprometido;
});

// Ensure virtuals are included in JSON output
stockSchema.set('toJSON', { virtuals: true });
stockSchema.set('toObject', { virtuals: true });

const Stock = mongoose.model('Stock', stockSchema);

export default Stock; 