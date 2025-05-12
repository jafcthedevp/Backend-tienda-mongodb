import mongoose from 'mongoose';

const inventoryMovementSchema = new mongoose.Schema({
    codigo_transaccion: {
        type: String,
        required: true,
        enum: ['CM', 'DC'] // CM: Compra, DC: Devolución Cliente
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    signo: {
        type: String,
        required: true,
        enum: ['+', '-']
    },
    producto_codigo: {
        type: String,
        required: true,
        ref: 'Product'
    },
    unidad_venta: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 0
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

// Índices para búsqueda eficiente
inventoryMovementSchema.index({ producto_codigo: 1, fecha: -1 });
inventoryMovementSchema.index({ codigo_transaccion: 1 });
inventoryMovementSchema.index({ estado: 1 });

const InventoryMovement = mongoose.model('InventoryMovement', inventoryMovementSchema);

export default InventoryMovement; 