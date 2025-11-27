# PM2025-2 Trabalho Final

## Descrição
Sistema de gerenciamento de laboratórios desenvolvido como trabalho final da disciplina PM2025-2.

## Estrutura do Projeto

### Pastas Criadas
- `projeto/` - Pasta principal do projeto
- `projeto/backend/` - Código do backend
- `projeto/frontend/` - Código do frontend web
- `projeto/mobile/` - Código da aplicação mobile
- `infraestrutura/` - Arquivos de infraestrutura e deploy

### Documentação
- `Documents/Horarios_Laboratórios.pdf` - Horários dos laboratórios
- `Documents/Requisitos_Sistema_Labs.pdf` - Requisitos do sistema

## Infraestrutura

### Serviços Docker
Configurados no arquivo `infraestrutura/docker-compose.yml`:

#### MongoDB
- **Serviço**: `pm2025-2-trabalho-final-mongo`
- **Usuário**: `pm2025-2-mongo-admin`
- **Senha**: `pm2025-2-mongo-secret`
- **Banco**: `pm2025-2-mongodb`
- **Porta**: `27017`

#### Portainer
- **Serviço**: `pm2025-2-trabalho-final-portainer`
- **Porta**: `9000`
- **Função**: Gerenciamento de containers Docker

#### Network
- **Nome**: `pm2025-2-network`
- **Driver**: bridge
- **Função**: Comunicação entre containers

## Como Executar

### Iniciar Infraestrutura
```bash
cd infraestrutura
docker-compose up -d
```

### Executar Backend
```bash
cd projeto/backend
npm install
npm run dev
```

### Executar Frontend
```bash
cd projeto/frontend
npm install
npm run dev
```

### Executar Mobile
```bash
cd projeto/mobile
npm install
npm start
```

### Acessar Serviços
- **Frontend Web**: `http://localhost:5173`
- **Mobile App**: Expo Development Server
- **API Backend**: `http://localhost:3000`
- **Documentação API**: `http://localhost:3000/api-docs`
- **MongoDB**: `localhost:27017`
- **Portainer**: `http://localhost:9000`

## Endpoints da API

### Instituições
- `POST /api/v1/instituicoes` - Criar instituição
- `GET /api/v1/instituicoes` - Listar instituições (com filtros)
- `PUT /api/v1/instituicoes/:id` - Atualizar instituição
- `DELETE /api/v1/instituicoes/:id` - Remover instituição

### Professores
- `POST /api/v1/professores` - Criar professor
- `GET /api/v1/professores` - Listar professores (com filtros)
- `PUT /api/v1/professores/:id` - Atualizar professor
- `DELETE /api/v1/professores/:id` - Remover professor

#### Parâmetros de Consulta
- `?ativo=true|false` - Filtrar por status
- `?nome=texto` - Filtrar por nome (contém)
- `?page=1&limit=20` - Paginação

## Funcionalidades Implementadas

✅ **Estrutura de Projeto**
- Organização em pastas (backend, frontend, mobile)
- Separação de infraestrutura
- Configuração de ambiente com .env
- Estrutura modular (controllers, models, routes, config)

✅ **Infraestrutura Docker**
- Serviço MongoDB 7 com autenticação
- Serviço Portainer para gerenciamento de containers
- Network dedicada (pm2025-2-network) para comunicação
- Volumes persistentes para dados (mongo_data, portainer_data)
- Health checks configurados
- Restart automático dos serviços

✅ **Backend - API REST (Node.js + Express + MongoDB)**
- Projeto Node.js com Express e Mongoose
- Modelo de dados para Instituições com validações
- CRUD completo para instituições (/api/v1/instituicoes)
- Validação de dados (CNPJ único, email válido, campos obrigatórios)
- Tratamento de erros centralizado
- Suporte a HTTPS configurável
- Documentação Swagger completa em /api-docs
- Middleware de segurança (Helmet, CORS, Morgan)
- Paginação e filtros nas consultas (ativo, nome, page, limit)
- Conexão MongoDB com autenticação
- Configuração flexível via variáveis de ambiente

✅ **Frontend Web - React + Vite + Material-UI**
- Projeto React 19 com Vite como bundler
- Layout responsivo com cabeçalho, área de trabalho e rodapé
- Menu lateral (drawer) com navegação
- Componente de Instituições com CRUD completo
- Componente de Professores com CRUD completo
- Tabelas de dados com ordenação e filtros
- Modais para criação e edição de registros
- Integração com API do backend via Axios
- Design responsivo para mobile e desktop
- Notificações de feedback (Snackbar)
- Formulários com validação
- Estados de loading e tratamento de erros
- Ordenação por colunas (TableSortLabel)
- Filtros em tempo real por texto

✅ **Mobile App - React Native + Expo**
- Projeto React Native 0.81 com Expo 54
- Interface Material Design com React Native Paper
- CRUD completo de Instituições idêntico ao web
- CRUD completo de Professores com interface mobile otimizada
- Cards responsivos para listagem de registros
- Formulários modais para criação/edição
- Filtros em tempo real por nome e outros campos
- Navegação com React Navigation (Bottom Tab Navigator)
- Integração com mesma API do backend
- Mensagens de feedback em português
- Confirmações nativas para exclusões
- Ícones vetoriais com React Native Vector Icons
- Gerenciamento de estado local
- Abas para navegação entre Instituições, Professores e Cursos

✅ **Modelo de Dados**
- **Instituições**: Schema Mongoose com validações
  - Campos: nome, cnpj, email, telefone, endereco, ativo
  - Validação de email com regex
  - CNPJ único no banco
- **Professores**: Schema Mongoose com validações
  - Campos: nome, email, telefone, especialidade, ativo
  - Validação de email com regex
  - Email único no banco
  - CRUD completo implementado no mobile
- Timestamps automáticos (createdAt, updatedAt)
- Índices para performance

✅ **Configurações e Segurança**
- Configuração de HTTPS opcional
- Helmet para headers de segurança
- CORS configurado para desenvolvimento
- Morgan para logging de requisições
- Validação de entrada de dados
- Tratamento de erros padronizado
- Variáveis de ambiente para configuração

✅ **Documentação e Qualidade**
- README.md completo e atualizado
- Documentos de requisitos e horários dos laboratórios
- JSDoc em todo o código backend
- Documentação Swagger da API com exemplos
- Comentários em português
- Estrutura de projeto documentada
- Status do projeto (PROJETO_STATUS.md)

✅ **Scripts e Automação**
- Scripts npm para desenvolvimento (dev) e produção (start)
- Nodemon para reload automático no desenvolvimento
- Build otimizado para produção (Vite)
- Linting configurado (ESLint)
- Expo CLI para desenvolvimento mobile

✅ **Dependências e Tecnologias**
- **Backend**: Express, Mongoose, Swagger, Helmet, CORS, Morgan, Dotenv
- **Frontend**: React 19, Material-UI, Axios, React Router DOM, Vite
- **Mobile**: React Native, Expo, React Navigation, React Native Paper, Axios
- **Infraestrutura**: Docker, MongoDB 7, Portainer
- **Desenvolvimento**: Nodemon, ESLint, Vite