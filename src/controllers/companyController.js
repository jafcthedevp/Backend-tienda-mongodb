import Company from '../models/Company.js';

export const getCompanies = async (req, res) => {
    try {
        const { estado } = req.query;
        const query = estado ? { estado } : {};

        const companies = await Company.find(query);
        res.json(companies);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const { codigo } = req.params;
        const company = await Company.findOne({ codigo });

        if (!company) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Company not found',
                status: 404
            });
        }

        res.json(company);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const createCompany = async (req, res) => {
    try {
        const { codigo, ruc, nombre, direccion, ubigeo, estado } = req.body;

        // Verificar si ya existe una empresa con el mismo código o RUC
        const existingCompany = await Company.findOne({
            $or: [{ codigo }, { ruc }]
        });

        if (existingCompany) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Company with this code or RUC already exists',
                status: 400
            });
        }

        const company = new Company({
            codigo,
            ruc,
            nombre,
            direccion,
            ubigeo,
            estado: estado || 'A'
        });

        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { codigo } = req.params;
        const { nombre, direccion, ubigeo, estado } = req.body;

        const company = await Company.findOne({ codigo });
        if (!company) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Company not found',
                status: 404
            });
        }

        // Actualizar solo los campos proporcionados
        if (nombre) company.nombre = nombre;
        if (direccion) company.direccion = direccion;
        if (ubigeo) company.ubigeo = ubigeo;
        if (estado) company.estado = estado;

        await company.save();
        res.json(company);
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { codigo } = req.params;
        const company = await Company.findOne({ codigo });

        if (!company) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Company not found',
                status: 404
            });
        }

        await company.deleteOne();
        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message,
            status: 500
        });
    }
}; 