const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Configurações
const config = require('./src/config/configurationLoader');
const { connectDatabase } = require('./src/config/database');
const { createHttpsServer } = require('./src/config/httpsConfig');
const { setupSwagger } = require('./src/config/swagger');
const errorHandler = require('./src/middleware/errorHandler');

// Rotas
const instituicoesRoutes = require('./src/routes/instituicoes');
const cursosRoutes = require('./src/routes/cursos');

/**
 * Aplicação Express principal
 * @module Server
 */

const app = express();

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: config.app.corsOrigin
}));

// Parser JSON
app.use(express.json());

// Conectar ao banco de dados
connectDatabase();

// Configurar Swagger
setupSwagger(app);

// Rotas da API
app.use('/api/v1/instituicoes', instituicoesRoutes);
app.use('/api/v1/cursos', cursosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sistema de Laboratórios - PM2025-2',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
const startServer = () => {
  const httpsServer = createHttpsServer(app);
  
  if (httpsServer) {
    httpsServer.listen(config.app.port, () => {
      console.log(`Servidor HTTPS rodando na porta ${config.app.port}`);
      console.log(`Acesse: https://localhost:${config.app.port}`);
    });
  } else {
    app.listen(config.app.port, () => {
      console.log(`Servidor HTTP rodando na porta ${config.app.port}`);
      console.log(`Acesse: http://localhost:${config.app.port}`);
    });
  }
};

startServer();

module.exports = app;