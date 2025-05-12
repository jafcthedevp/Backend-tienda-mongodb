import Customer from '../models/Customer.js';

export const getCustomers = async (req, res) => {
    try {
        const { estado, search } = req.query;
        const query = {};

        if (estado) {
            query.estado = estado;
        }

        if (search) {
            query.$or = [
                { nombres: { $regex: search, $options: 'i' } },
                { apellido_paterno: { $regex: search, $options: 'i' } },
                { apellido_materno: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const customers = await Customer.find(query);
        res.json(customers);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const getCustomer = async (req, res) => {
    try {
        const { codigo } = req.params;
        const customer = await Customer.findOne({ codigo });

        if (!customer) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Customer not found',
                status: 404
            });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const { 
            codigo, 
            nombres, 
            apellido_paterno, 
            apellido_materno, 
            celular, 
            email, 
            estado 
        } = req.body;

        // Verificar si ya existe un cliente con el mismo código o email
        const existingCustomer = await Customer.findOne({
            $or: [{ codigo }, { email }]
        });

        if (existingCustomer) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Customer with this code or email already exists',
                status: 400
            });
        }

        const customer = new Customer({
            codigo,
            nombres,
            apellido_paterno,
            apellido_materno,
            celular,
            email,
            estado: estado || 'A'
        });

        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { 
            nombres, 
            apellido_paterno, 
            apellido_materno, 
            celular, 
            email, 
            estado 
        } = req.body;

        const customer = await Customer.findOne({ codigo });
        if (!customer) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Customer not found',
                status: 404
            });
        }

        // Si se está actualizando el email, verificar que no exista
        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    error: 'Validation error',
                    message: 'Email already in use',
                    status: 400
                });
            }
        }

        // Actualizar solo los campos proporcionados
        if (nombres) customer.nombres = nombres;
        if (apellido_paterno) customer.apellido_paterno = apellido_paterno;
        if (apellido_materno) customer.apellido_materno = apellido_materno;
        if (celular) customer.celular = celular;
        if (email) customer.email = email;
        if (estado) customer.estado = estado;

        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { codigo } = req.params;
        const customer = await Customer.findOne({ codigo });

        if (!customer) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Customer not found',
                status: 404
            });
        }

        await customer.deleteOne();
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
}; 