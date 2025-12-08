# Consultas Mobile - Documentação

## Visão Geral
Implementação da funcionalidade de consultas de horários no aplicativo mobile, permitindo visualização em grade de aulas por laboratório, curso, disciplina ou professor.

## Estrutura de Arquivos
```
src/
  components/
    Consultas/
      ConsultasScreen.js    # Tela principal de consultas
```

## Funcionalidades Implementadas

### 1. Filtros de Consulta
- **Laboratório**: Filtra aulas por laboratório específico
- **Curso**: Filtra aulas por curso
- **Disciplina**: Filtra aulas por disciplina
- **Professor**: Filtra aulas por professor
- **Limpar Filtros**: Remove todos os filtros aplicados

### 2. Grade Visual de Horários
- **Layout em Grade**: Organização por dias da semana (colunas) e horários (linhas)
- **Scroll Horizontal e Vertical**: Navegação completa pela grade
- **Cards Coloridos**: Cada disciplina recebe uma cor diferente
- **Informações do Card**:
  - Nome da disciplina
  - Nome do professor
  - Nome do curso
  - Horário (bloco)

### 3. Organização dos Dados
- **Dias da Semana**: Segunda a Sábado
- **Blocos de Horário**: Ordenados por horário de início
- **Cores**: 8 cores diferentes para identificação visual de disciplinas

## Componentes e Funções

### Principais Funções

#### `carregarDadosIniciais()`
Carrega todos os dados necessários (cursos, disciplinas, professores, laboratórios, blocos).

#### `carregarAulas()`
Busca aulas da API aplicando filtros selecionados.

#### `organizarGrade()`
Organiza aulas em estrutura de grade (dia x horário).
- Retorna objeto com estrutura: `grade[dia][blocoId] = aula`

#### `normalizarAula(aula)`
Converte IDs em nomes legíveis e adiciona cor.
- Parâmetros: `aula` (objeto da aula)
- Retorna: objeto com campos `cursoNome`, `disciplinaNome`, `professorNome`, `laboratorioNome`, `cor`

#### `obterCorDisciplina(disciplinaId)`
Atribui cor baseada no índice da disciplina.
- Parâmetros: `disciplinaId` (string)
- Retorna: cor hexadecimal (string)

#### `obterHorarioBloco(blocoId)`
Formata horário do bloco (ex: "08:00-09:40").
- Parâmetros: `blocoId` (string)
- Retorna: string formatada

#### `limparFiltros()`
Remove todos os filtros aplicados.

#### `toggleMenu(menu)`
Alterna visibilidade dos menus de filtro.

## Integração com API

### Endpoints Utilizados
- `GET /api/v1/aulas` - Lista aulas com filtros
- `GET /api/v1/cursos` - Lista cursos
- `GET /api/v1/disciplinas` - Lista disciplinas
- `GET /api/v1/professores` - Lista professores
- `GET /api/v1/laboratorios` - Lista laboratórios
- `GET /api/v1/blocos-horario` - Lista blocos de horário

### Query Parameters
```javascript
{
  cursoId: string,
  disciplinaId: string,
  professorId: string,
  laboratorioId: string
}
```

## Estrutura de Dados

### Aula
```javascript
{
  _id: string,
  semestre: string,
  cursoId: ObjectId | { _id, nome },
  disciplinaId: ObjectId | { _id, nome },
  professorId: ObjectId | { _id, nome },
  laboratorioId: ObjectId | { _id, nome },
  diaSemana: string,
  blocos: [ObjectId],
  dataInicio: Date,
  dataFim: Date
}
```

### Grade Organizada
```javascript
{
  "Segunda-feira": {
    "blocoId1": aulaObjeto | null,
    "blocoId2": aulaObjeto | null,
    ...
  },
  "Terça-feira": { ... },
  ...
}
```

## Estilos e Layout

### Cores de Disciplinas
```javascript
['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
 '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
```

### Dimensões
- **Célula de Horário**: 80px largura
- **Célula de Aula**: 120px largura, 80px altura mínima
- **Header**: Fundo roxo (#6200ee)

### Componentes Visuais
- **Appbar**: Cabeçalho com título
- **Filtros**: Área com botões de menu dropdown
- **Grade**: ScrollView horizontal + vertical
- **Cards**: Elevação 2, fundo colorido
- **Snackbar**: Mensagens de feedback

## Fluxo de Dados

1. **Inicialização**:
   - Carrega dados iniciais (cursos, disciplinas, etc.)
   - Carrega aulas sem filtros

2. **Aplicação de Filtros**:
   - Usuário seleciona filtro
   - Estado `filtros` é atualizado
   - `useEffect` detecta mudança e recarrega aulas

3. **Renderização da Grade**:
   - Aulas são organizadas em estrutura de grade
   - Blocos são ordenados por horário
   - Cards são renderizados com cores e informações

4. **Interação**:
   - Scroll horizontal para ver todos os dias
   - Scroll vertical para ver todos os horários
   - Menus dropdown para seleção de filtros

## Tratamento de Erros

- Mensagens em português via Snackbar
- Fallback para arrays vazios em caso de erro
- Validação de estrutura de resposta da API

## Responsividade

- Layout adaptável para diferentes tamanhos de tela
- Scroll horizontal e vertical para navegação completa
- Cards compactos otimizados para mobile
- Texto truncado com `numberOfLines={1}`

## Melhorias Futuras

- [ ] Adicionar filtro por dia da semana
- [ ] Implementar busca por texto
- [ ] Adicionar visualização em lista como alternativa
- [ ] Permitir exportar grade como imagem
- [ ] Adicionar legenda de cores
- [ ] Implementar zoom na grade
- [ ] Adicionar detalhes ao tocar no card
- [ ] Implementar cache local dos dados
