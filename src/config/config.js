import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const config = {
    // Configuración del servidor
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Configuración de la base de datos
    mongodbUri: process.env.MONGODB_URI,

    // Configuración de JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

    // Configuración de seguridad
    corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Validar variables de entorno requeridas
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

export default config; 