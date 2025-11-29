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
const professorRoutes = require('./routes/professorRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const laboratorioRoutes = require('./routes/laboratorioRoutes');
const blocoHorarioRoutes = require('./routes/blocoHorarioRoutes');
app.use('/api/v1/instituicoes', instituicoesRoutes);
app.use('/api/v1/cursos', cursosRoutes);
app.use('/api/v1/professores', professorRoutes);
app.use('/api/v1/disciplinas', disciplinaRoutes);
app.use('/api/v1/laboratorios', laboratorioRoutes);
app.use('/api/v1/blocos-horario', blocoHorarioRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Backend PM2025-2 funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;