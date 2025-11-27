const mongoose = require('mongoose');
const config = require('./configurationLoader');

/**
 * Configuração e conexão com MongoDB
 * @module Database
 */

/**
 * Conecta ao MongoDB usando as configurações do .env
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  try {
    const { host, port, database } = config.mongo;
    // Para desenvolvimento local, usar conexão simples sem autenticação
    const connectionString = `mongodb://${host}:${port}/${database}`;
    
    await mongoose.connect(connectionString);
    console.log('Conectado ao MongoDB com sucesso:', connectionString);
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    console.log('Tentando conectar sem autenticação...');
    
    try {
      // Fallback para MongoDB local padrão
      await mongoose.connect('mongodb://localhost:27017/pm2025-2-mongodb');
      console.log('Conectado ao MongoDB local sem autenticação');
    } catch (fallbackError) {
      console.error('Erro na conexão fallback:', fallbackError.message);
      process.exit(1);
    }
  }
};

module.exports = { connectDatabase };