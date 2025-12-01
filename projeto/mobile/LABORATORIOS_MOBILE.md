# Laboratórios - Mobile App

## Descrição
Componente mobile para gerenciamento de laboratórios com interface otimizada para dispositivos móveis.

## Funcionalidades Implementadas

### CRUD Completo
- ✅ **Criar**: Formulário modal para criação de novos laboratórios
- ✅ **Listar**: Exibição em cards responsivos com informações principais
- ✅ **Editar**: Formulário modal pré-preenchido para edição
- ✅ **Excluir**: Confirmação nativa antes da remoção

### Interface Mobile Otimizada
- ✅ **Cards Responsivos**: Layout em cards para melhor visualização em telas pequenas
- ✅ **Busca em Tempo Real**: Filtro por qualquer campo do laboratório
- ✅ **Navegação por Abas**: Integração com React Navigation
- ✅ **Formulários Modais**: Dialogs para criação/edição com scroll
- ✅ **Feedback Visual**: Snackbars para notificações e status chips

### Campos do Laboratório
- **Nome**: Campo obrigatório, máximo 100 caracteres
- **Código**: Campo obrigatório, único, convertido para maiúsculas
- **Capacidade**: Campo numérico obrigatório (1-200 pessoas)
- **Localização**: Campo obrigatório, máximo 200 caracteres
- **Descrição**: Campo opcional, máximo 500 caracteres
- **Status**: Boolean (Ativo/Inativo) com switch

### Validações e Tratamento de Erros
- ✅ **Código Único**: Tratamento de erro 409 (Conflict) para códigos duplicados
- ✅ **Não Encontrado**: Tratamento de erro 404 para operações PUT/DELETE
- ✅ **Validação de Campos**: Campos obrigatórios e limites de caracteres
- ✅ **Mensagens em Português**: Todas as mensagens de erro em pt-BR

### Integração com Backend
- ✅ **Endpoint**: `/api/v1/laboratorios`
- ✅ **Métodos HTTP**: GET, POST, PUT, DELETE
- ✅ **Filtros**: Suporte a filtros por status, nome, localização, capacidade
- ✅ **Paginação**: Suporte a paginação (page, limit)

## Componentes Utilizados

### React Native Paper
- `Appbar`: Cabeçalho da tela
- `Card`: Exibição dos laboratórios
- `FAB`: Botão flutuante para adicionar
- `Searchbar`: Barra de busca
- `Dialog`: Modais para formulários e confirmações
- `TextInput`: Campos de entrada
- `Switch`: Toggle para status
- `Snackbar`: Notificações
- `Chip`: Indicador de status

### React Navigation
- Integração com Bottom Tab Navigator
- Ícone: `flask` (MaterialCommunityIcons)

## Estrutura de Arquivos
```
src/components/Laboratorios/
└── LaboratoriosScreen.js
```

## Documentação JSDoc
Todos os métodos e componentes possuem documentação JSDoc completa em português, incluindo:
- Descrição da função
- Parâmetros com tipos
- Valores de retorno
- Exemplos de uso quando aplicável

## Estados Gerenciados
- `laboratorios`: Lista de laboratórios
- `loading`: Estado de carregamento
- `dialogVisible`: Controle do modal de formulário
- `editingId`: ID do laboratório sendo editado
- `filtro`: Texto de busca
- `formData`: Dados do formulário
- `snackbarVisible/Message`: Controle de notificações
- `confirmDialogVisible`: Controle do modal de confirmação

## Critérios de Aceite Atendidos
- ✅ Interface baseada em cards para dispositivos móveis
- ✅ Navegação para nova tela (modal) para formulários
- ✅ Busca e filtros otimizados para telas pequenas
- ✅ Integração com endpoint `/api/v1/laboratorios`
- ✅ Tratamento de erro 409 para códigos duplicados
- ✅ Tratamento de erro 404 para IDs inexistentes
- ✅ Todas as mensagens em português brasileiro
- ✅ Documentação JSDoc completa