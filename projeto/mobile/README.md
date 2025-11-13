# Mobile App - Sistema de Gerenciamento de Laboratórios

Aplicação mobile React Native com Expo para gerenciamento de instituições.

## Funcionalidades

- ✅ CRUD completo de Instituições
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
│   └── Instituicoes/
│       └── InstituicoesScreen.js
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

### Interface
- Design Material seguindo padrões do React Native Paper
- Cards responsivos para listagem
- FAB (Floating Action Button) para nova instituição
- Dialogs modais para formulários
- Snackbars para feedback
- Searchbar para filtros

### Integração com API
- Mesmos endpoints do frontend web
- Tratamento de erros com mensagens em português
- Suporte aos critérios de aceite:
  - GET retorna array JSON
  - POST com CNPJ repetido retorna 409
  - PUT/DELETE com ID inexistente retornam 404
  - Mensagens em pt-BR