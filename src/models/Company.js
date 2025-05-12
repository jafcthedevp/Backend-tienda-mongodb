import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,  // Esto ya crea un índice
    trim: true
  },
  ruc: {
    type: String,
    required: true,
    unique: true,  // Esto ya crea un índice
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  ubigeo: {
    type: String,
    required: true,
    trim: true
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

// Solo mantén los índices no duplicados
// Elimina los de codigo y ruc porque ya están definidos como unique
companySchema.index({ nombre: 'text' });
companySchema.index({ estado: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;