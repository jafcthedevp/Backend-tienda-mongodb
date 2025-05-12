import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{13}$/.test(v);
      },
      message: props => `${props.value} debe tener exactamente 13 dígitos!`
    }
  },
  descripcion: {
    type: String,
    required: true
  },
  unidad_venta: {
    type: String,
    required: true,
    trim: true
  },
  categoria_codigo: {
    type: String,
    required: true,
    trim: true
  },
  subcategoria_codigo: {
    type: String,
    trim: true
  },
  contenido_unidad: {
    type: String,
    required: true
  },
  info_adicional: {
    type: String
  },
  estado: {
    type: String,
    enum: ['A', 'I'],
    default: 'A'
  },
  foto_url: {
    type: String
  },
  moneda: {
    type: String,
    required: true,
    default: 'USD'
  },
  valor_venta: {
    type: Number,
    required: true,
    min: 0
  },
  tasa_impuesto: {
    type: Number,
    required: true,
    min: 0,
    default: 0.16
  },
  precio_venta: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Crear índices para búsqueda
productSchema.index({ codigo: 1 }, { unique: true });
productSchema.index({ descripcion: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product; 