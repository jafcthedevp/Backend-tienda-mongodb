import Joi from 'joi';

const schemas = {
    auth: {
        register: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        login: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    },
    product: {
        create: Joi.object({
            codigo: Joi.string().length(13).required(),
            descripcion: Joi.string().required(),
            unidad_venta: Joi.string().required(),
            categoria_codigo: Joi.string().required(),
            subcategoria_codigo: Joi.string().allow(''),
            contenido_unidad: Joi.number().required(),
            info_adicional: Joi.string().allow(''),
            estado: Joi.string().valid('A', 'I').default('A'),
            foto_url: Joi.string().uri().allow(''),
            moneda: Joi.string().valid('USD', 'EUR', 'COP').default('COP'),
            valor_venta: Joi.number().required(),
            tasa_impuesto: Joi.number().required(),
            precio_venta: Joi.number().required()
        }),
        update: Joi.object({
            descripcion: Joi.string(),
            unidad_venta: Joi.string(),
            categoria_codigo: Joi.string(),
            subcategoria_codigo: Joi.string().allow(''),
            contenido_unidad: Joi.number(),
            info_adicional: Joi.string().allow(''),
            estado: Joi.string().valid('A', 'I'),
            foto_url: Joi.string().uri().allow(''),
            moneda: Joi.string().valid('USD', 'EUR', 'COP'),
            valor_venta: Joi.number(),
            tasa_impuesto: Joi.number(),
            precio_venta: Joi.number()
        })
    },
    category: {
        create: Joi.object({
            codigo: Joi.string().required(),
            tipo: Joi.string().valid('C', 'S').default('C'),
            descripcion: Joi.string().required(),
            imagen_url: Joi.string().uri().allow(''),
            estado: Joi.string().valid('A', 'I').default('A')
        }),
        update: Joi.object({
            tipo: Joi.string().valid('C', 'S'),
            descripcion: Joi.string(),
            imagen_url: Joi.string().uri().allow(''),
            estado: Joi.string().valid('A', 'I')
        })
    },
    stock: {
        update: Joi.object({
            stock_comprometido: Joi.number().min(0),
            stock_fisico: Joi.number().min(0)
        }).min(1) // Requiere al menos uno de los campos
    },
    inventoryMovement: {
        create: Joi.object({
            codigo_transaccion: Joi.string().valid('CM', 'DC').required(),
            signo: Joi.string().valid('+', '-').required(),
            producto_codigo: Joi.string().required(),
            unidad_venta: Joi.string().required(),
            cantidad: Joi.number().min(0).required()
        }),
        updateStatus: Joi.object({
            estado: Joi.string().valid('A', 'I').required()
        })
    },
    company: {
        create: Joi.object({
            codigo: Joi.string().required(),
            ruc: Joi.string().required(),
            nombre: Joi.string().required(),
            direccion: Joi.string().required(),
            ubigeo: Joi.string().required(),
            estado: Joi.string().valid('A', 'I').default('A')
        }),
        update: Joi.object({
            nombre: Joi.string(),
            direccion: Joi.string(),
            ubigeo: Joi.string(),
            estado: Joi.string().valid('A', 'I')
        }).min(1)
    },
    customer: {
        create: Joi.object({
            codigo: Joi.string().required(),
            nombres: Joi.string().required(),
            apellido_paterno: Joi.string().required(),
            apellido_materno: Joi.string().required(),
            celular: Joi.string().required(),
            email: Joi.string().email().required(),
            estado: Joi.string().valid('A', 'I').default('A')
        }),
        update: Joi.object({
            nombres: Joi.string(),
            apellido_paterno: Joi.string(),
            apellido_materno: Joi.string(),
            celular: Joi.string(),
            email: Joi.string().email(),
            estado: Joi.string().valid('A', 'I')
        }).min(1).required()
    }
};

export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                error: 'Validation error',
                message: errors.join(', '),
                status: 400
            });
        }
        next();
    };
};

export const validateRequest = (schemaName, method) => {
    return (req, res, next) => {
        const schema = schemas[schemaName]?.[method];
        if (!schema) {
            return res.status(500).json({
                error: 'Validation error',
                message: `Schema ${schemaName}.${method} not found`,
                status: 500
            });
        }
        return validate(schema)(req, res, next);
    };
};

export { schemas }; 