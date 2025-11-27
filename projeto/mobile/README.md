# Mobile App - Sistema de Gerenciamento de Laboratórios

Aplicação mobile React Native com Expo para gerenciamento de instituições.

## Funcionalidades

- ✅ CRUD completo de Instituições
- ✅ CRUD completo de Professores
- ✅ Interface responsiva com React Native Paper
- ✅ Navegação com React Navigation
- ✅ Integração com API backend
- ✅ Validação de dados
- ✅ Mensagens de feedback em português

## Tecnologias

- React Native com Expo
- React Native Paper (Material Design)
- React Navigation
- Axios para requisições HTTP

## Como Executar

### Pré-requisitos
- Node.js instalado
- Expo CLI: `npm install -g @expo/cli`
- Backend rodando em `http://localhost:3000`

### Instalação
```bash
cd projeto/mobile
npm install
```

### Executar
```bash
# Iniciar o servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── Instituicoes/
│   │   └── InstituicoesScreen.js
│   ├── Professores/
│   │   └── ProfessoresScreen.js
│   └── Cursos/
│       └── CursosScreen.js
└── services/
    └── api.js
```

## Funcionalidades Implementadas

### CRUD de Instituições
- **Listar**: Visualização em cards com informações principais
- **Criar**: Formulário completo com validação
- **Editar**: Edição inline com dados pré-preenchidos
- **Excluir**: Confirmação antes da remoção
- **Filtrar**: Busca em tempo real por qualquer campo

### CRUD de Professores
- **Listar**: Cards responsivos com dados do professor
- **Criar**: Formulário com campos nome, email, telefone e especialidade
- **Editar**: Edição com dados pré-preenchidos
- **Excluir**: Confirmação nativa antes da remoção
- **Filtrar**: Busca em tempo real por nome, email ou especialidade
- **Status**: Controle de ativo/inativo com switch

### Interface
- Design Material seguindo padrões do React Native Paper
- Cards responsivos para listagem
- FAB (Floating Action Button) para novos registros
- Dialogs modais para formulários
- Snackbars para feedback
- Searchbar para filtros
- Navegação por abas (Bottom Tab Navigator)

### Integração com API
- Endpoints `/api/v1/instituicoes` e `/api/v1/professores`
- Tratamento de erros com mensagens em português
- Suporte aos critérios de aceite:
  - GET retorna array JSON
  - POST com email repetido retorna 409 (Professores)
  - POST com CNPJ repetido retorna 409 (Instituições)
  - PUT/DELETE com ID inexistente retornam 404
  - Mensagens em pt-BR