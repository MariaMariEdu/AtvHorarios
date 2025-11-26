const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

/**
 * Aplicação Express principal
 */
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://pm2025-2-mongo-admin:pm2025-2-mongo-secret@localhost:27017/pm2025-2-mongodb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
const instituicoesRoutes = require('./routes/instituicoes');
const cursosRoutes = require('./routes/cursos');
app.use('/api/v1/instituicoes', instituicoesRoutes);
app.use('/api/v1/cursos', cursosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Backend PM2025-2 funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;