# CRUD Disciplinas - Mobile App

## Descrição
Implementação completa do CRUD de Disciplinas para a aplicação mobile, seguindo os requisitos do RF01.

## Funcionalidades Implementadas

### ✅ CRUD Completo
- **Criar**: Formulário modal com validação de campos obrigatórios
- **Listar**: Cards responsivos com informações completas
- **Editar**: Formulário pré-preenchido com dados existentes
- **Excluir**: Confirmação nativa antes da remoção

### ✅ Interface Mobile Otimizada
- **Cards**: Layout responsivo para dispositivos móveis
- **Formulários Modais**: Abertura em nova tela simulando comportamento web
- **Menus Dropdown**: Seleção intuitiva de cursos e professores
- **Filtros**: Busca em tempo real por qualquer campo
- **Navegação**: Aba dedicada no Bottom Tab Navigator

### ✅ Integração com API
- **Endpoint Base**: `/api/v1/disciplinas`
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Tratamento de Erros**:
  - Status 409: Código duplicado
  - Status 404: Disciplina não encontrada
  - Mensagens em português brasileiro

### ✅ Validações e Tratamentos
- **Campos Obrigatórios**: Nome, código, carga horária
- **Código Único**: Validação no backend com feedback específico
- **Carga Horária**: Entrada numérica com conversão automática
- **Status**: Seleção entre Ativa, Inativa, Planejada

## Estrutura de Arquivos

```
src/
├── components/
│   └── Disciplinas/
│       └── DisciplinasScreen.js    # Componente principal
└── services/
    └── api.js                      # Serviços de API (disciplinasService)
```

## Campos do Formulário

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Nome | Texto | Sim | Nome da disciplina |
| Código | Texto | Sim | Código único da disciplina |
| Carga Horária | Numérico | Sim | Horas da disciplina |
| Curso | Seleção | Não | Curso associado (dropdown) |
| Professor | Seleção | Não | Professor responsável (dropdown) |
| Status | Seleção | Sim | Ativa/Inativa/Planejada |

## Recursos de UX/UI

### Cards de Listagem
- **Título**: Nome da disciplina
- **Informações**: Código, carga horária, curso, professor
- **Status**: Chip colorido (verde/vermelho/laranja)
- **Ações**: Botões de editar e excluir

### Formulário Modal
- **Campos de Texto**: Nome, código, carga horária
- **Menus Dropdown**: Curso, professor, status
- **Validação**: Feedback imediato de erros
- **Botões**: Cancelar e Salvar/Atualizar

### Filtros e Busca
- **Searchbar**: Busca em tempo real
- **Filtro Global**: Busca em todos os campos da disciplina
- **Performance**: Filtro local sem requisições desnecessárias

## Tratamento de Erros

### Códigos de Status HTTP
- **200**: Operação bem-sucedida
- **409**: Conflito - código já existe
- **404**: Disciplina não encontrada
- **500**: Erro interno do servidor

### Mensagens de Feedback
- **Sucesso**: "Disciplina criada/atualizada/removida com sucesso"
- **Erro 409**: "Código da disciplina já existe. Por favor, use um código diferente."
- **Erro 404**: "Disciplina não encontrada"
- **Erro Genérico**: "Erro ao [operação] disciplina"

## Integração com Outras Entidades

### Cursos
- **Carregamento**: Lista completa na inicialização
- **Exibição**: Nome do curso nos cards
- **Seleção**: Menu dropdown no formulário

### Professores
- **Carregamento**: Lista completa na inicialização
- **Exibição**: Nome do professor nos cards
- **Seleção**: Menu dropdown no formulário

## Navegação

### Bottom Tab Navigator
- **Ícone**: `book-open-variant` (Material Community Icons)
- **Título**: "Disciplinas"
- **Posição**: Quarta aba (após Cursos)

## Documentação JSDoc

Todos os métodos e componentes possuem documentação JSDoc completa:
- **Descrição**: Propósito da função/componente
- **Parâmetros**: Tipos e descrições
- **Retornos**: Tipos de retorno
- **Exemplos**: Quando aplicável

## Critérios de Aceite Atendidos

### ✅ Funcionalidades CRUD
- [x] Criar disciplina com validação
- [x] Listar disciplinas com filtros
- [x] Editar disciplina existente
- [x] Remover disciplina com confirmação

### ✅ Interface Mobile
- [x] Cards responsivos para listagem
- [x] Formulários modais para edição
- [x] Filtros otimizados para mobile
- [x] Navegação intuitiva

### ✅ Integração Backend
- [x] Endpoint `/api/v1/disciplinas`
- [x] Tratamento de status 409 (conflito)
- [x] Tratamento de status 404 (não encontrado)
- [x] Mensagens em português brasileiro

### ✅ Localização
- [x] Interface em português
- [x] Mensagens de erro em português
- [x] Feedback de sucesso em português
- [x] Labels e placeholders em português