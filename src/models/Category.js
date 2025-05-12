import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['C', 'S'],
        default: 'C'
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen_url: {
        type: String
    },
    estado: {
        type: String,
        enum: ['A', 'I'],
        default: 'A'
    }
}, {
    timestamps: true
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent_id'
});

// Ensure virtuals are included in JSON output
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

// Crear índices para búsqueda
categorySchema.index({ codigo: 1 }, { unique: true });
categorySchema.index({ descripcion: 'text' });

const Category = mongoose.model('Category', categorySchema);

export default Category; 