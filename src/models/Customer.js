import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,  // Esto ya crea un índice
    trim: true
  },
  nombres: {
    type: String,
    required: true,
    trim: true
  },
  apellido_paterno: {
    type: String,
    required: true,
    trim: true
  },
  apellido_materno: {
    type: String,
    required: true,
    trim: true
  },
  celular: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Esto ya crea un índice
    trim: true,
    lowercase: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['A', 'I'],
    default: 'A'
  }
}, {
  timestamps: true
});

// Removí los índices duplicados (codigo y email)
// y dejé solo los índices adicionales

// Índice de texto para búsqueda
customerSchema.index({ 
  nombres: 'text', 
  apellido_paterno: 'text', 
  apellido_materno: 'text' 
});
customerSchema.index({ estado: 1 });

// Virtual para nombre completo
customerSchema.virtual('nombre_completo').get(function() {
  return `${this.nombres} ${this.apellido_paterno} ${this.apellido_materno}`.trim();
});

// Asegurar que los virtuals se incluyan en JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;