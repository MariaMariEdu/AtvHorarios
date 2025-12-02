# Módulo de Aulas - Mobile

## Descrição
Implementação completa do CRUD de Aulas para a aplicação mobile, seguindo os padrões estabelecidos no projeto.

## Funcionalidades Implementadas

### 1. Listagem de Aulas
- **Componente**: `AulasScreen`
- **Funcionalidade**: Exibe todas as aulas em formato de cards responsivos
- **Campos Exibidos**:
  - Semestre e nome da disciplina (título)
  - Nome do curso
  - Nome do professor
  - Nome do laboratório
  - Horários dos blocos selecionados
  - Período (data início - data fim)
  - Dia da semana (chip colorido)

### 2. Busca e Filtros
- **Campo de Busca**: Searchbar no topo da tela
- **Filtros Suportados**:
  - Semestre
  - Dia da semana
  - Nome do curso
  - Nome da disciplina
  - Nome do professor
- **Comportamento**: Busca em tempo real (case-insensitive)

### 3. Criação de Aulas
- **Acesso**: FAB (Floating Action Button) no canto inferior direito
- **Formulário Modal**: Dialog com scroll para campos extensos
- **Campos Obrigatórios**:
  - Semestre (TextInput)
  - Curso (Menu dropdown)
  - Disciplina (Menu dropdown)
  - Professor (Menu dropdown)
  - Laboratório (Menu dropdown)
  - Dia da semana (Menu dropdown)
  - Blocos de horário (Seleção múltipla)
  - Data de início (TextInput formato AAAA-MM-DD)
  - Data de fim (TextInput formato AAAA-MM-DD)

### 4. Edição de Aulas
- **Acesso**: Ícone de lápis no card da aula
- **Comportamento**: Abre o mesmo formulário preenchido com dados existentes
- **Validação**: Mesmas regras da criação

### 5. Remoção de Aulas
- **Acesso**: Ícone de lixeira no card da aula
- **Confirmação**: Dialog de confirmação antes da exclusão
- **Feedback**: Snackbar com resultado da operação

## Componentes Técnicos

### Seletores Implementados

#### 1. Seletor de Curso
```javascript
<Menu
  visible={cursoMenuVisible}
  onDismiss={() => setCursoMenuVisible(false)}
  anchor={<Button>Selecionar Curso</Button>}
>
  {cursos.map((curso) => (
    <Menu.Item key={curso._id} title={curso.nome} />
  ))}
</Menu>
```

#### 2. Seletor de Disciplina
- Menu dropdown com lista de disciplinas disponíveis
- Exibe nome da disciplina selecionada

#### 3. Seletor de Professor
- Menu dropdown com lista de professores disponíveis
- Exibe nome do professor selecionado

#### 4. Seletor de Laboratório
- Menu dropdown com lista de laboratórios disponíveis
- Exibe nome do laboratório selecionado

#### 5. Seletor de Dia da Semana
- Menu dropdown com opções fixas:
  - Segunda-feira
  - Terça-feira
  - Quarta-feira
  - Quinta-feira
  - Sexta-feira
  - Sábado

#### 6. Seletor de Blocos de Horário (Multiseleção)
```javascript
{blocosHorarios.map((bloco) => (
  <Button
    mode={formData.blocos.includes(bloco._id) ? 'contained' : 'outlined'}
    onPress={() => alternarBlocoHorario(bloco._id)}
  >
    {bloco.nome || `${bloco.turno} - ${bloco.inicio}-${bloco.fim}`}
  </Button>
))}
```

#### 7. DatePickers para Datas
```javascript
<Button
  mode="outlined"
  onPress={() => setShowDataInicioPicker(true)}
  icon="calendar"
>
  Data de Início: {formatarData(formData.dataInicio)}
</Button>

{showDataInicioPicker && (
  <DateTimePicker
    value={formData.dataInicio}
    mode="date"
    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
    onChange={onChangeDataInicio}
    locale="pt-BR"
  />
)}
```

### Validações e Tratamento de Erros

#### 1. Validação de Conflitos (Status 409)
- Detecta conflitos de horário (laboratório ocupado, professor com choque)
- Exibe mensagem específica do backend em português
- Mantém o formulário aberto para correção

#### 2. Validação de Não Encontrado (Status 404)
- Trata casos onde a aula não existe mais (PUT/DELETE)
- Exibe mensagem "Aula não encontrada"
- Atualiza a lista automaticamente

#### 3. Validação de Campos Obrigatórios
- Todos os campos são obrigatórios conforme especificação
- Validação realizada no backend
- Mensagens de erro em português brasileiro

### Integração com API

#### Endpoints Utilizados
- `GET /api/v1/aulas` - Listagem de aulas
- `POST /api/v1/aulas` - Criação de aula
- `PUT /api/v1/aulas/:id` - Atualização de aula
- `DELETE /api/v1/aulas/:id` - Remoção de aula

#### Endpoints de Apoio
- `GET /api/v1/cursos` - Lista de cursos para seleção
- `GET /api/v1/disciplinas` - Lista de disciplinas para seleção
- `GET /api/v1/professores` - Lista de professores para seleção
- `GET /api/v1/laboratorios` - Lista de laboratórios para seleção
- `GET /api/v1/blocos-horario` - Lista de blocos para seleção

### Formatação de Dados

#### 1. Datas
- **Entrada**: Formato ISO (AAAA-MM-DD)
- **Exibição**: Formato brasileiro (DD/MM/AAAA)
- **Conversão**: Automática via `toLocaleDateString('pt-BR')`

#### 2. Horários dos Blocos
- **Formato**: HH:mm-HH:mm
- **Múltiplos**: Separados por vírgula
- **Exemplo**: "08:00-09:50, 10:00-11:50"

#### 3. Referências de Entidades
- **Normalização**: Converte ObjectIds para nomes legíveis
- **Fallback**: Mensagens "não encontrado" para referências inválidas

## Estados e Gerenciamento

### Estados Principais
```javascript
const [aulas, setAulas] = useState([]);
const [cursos, setCursos] = useState([]);
const [disciplinas, setDisciplinas] = useState([]);
const [professores, setProfessores] = useState([]);
const [laboratorios, setLaboratorios] = useState([]);
const [blocosHorarios, setBlocosHorarios] = useState([]);
```

### Estados de UI
```javascript
const [loading, setLoading] = useState(false);
const [dialogVisible, setDialogVisible] = useState(false);
const [editingId, setEditingId] = useState(null);
const [filtro, setFiltro] = useState('');
const [snackbarVisible, setSnackbarVisible] = useState(false);
```

### Estados de Menus
```javascript
const [cursoMenuVisible, setCursoMenuVisible] = useState(false);
const [disciplinaMenuVisible, setDisciplinaMenuVisible] = useState(false);
const [professorMenuVisible, setProfessorMenuVisible] = useState(false);
const [laboratorioMenuVisible, setLaboratorioMenuVisible] = useState(false);
const [diaSemanaMenuVisible, setDiaSemanaMenuVisible] = useState(false);
const [blocosMenuVisible, setBlocosMenuVisible] = useState(false);
```

### Estados dos DatePickers
```javascript
const [showDataInicioPicker, setShowDataInicioPicker] = useState(false);
const [showDataFimPicker, setShowDataFimPicker] = useState(false);
```

## Padrões de Design

### 1. Cards Responsivos
- Layout flexível para diferentes tamanhos de tela
- Informações hierarquizadas (título, subtítulos, detalhes)
- Ações (editar/remover) sempre visíveis

### 2. Formulário Modal
- Dialog com scroll para acomodar todos os campos
- Campos organizados logicamente
- Botões de ação na parte inferior

### 3. Feedback Visual
- Snackbar para mensagens de sucesso/erro
- Loading states durante operações
- Chips coloridos para categorização

### 4. Navegação Intuitiva
- FAB para criação (padrão Material Design)
- Ícones universais (lápis para editar, lixeira para remover)
- Confirmações para ações destrutivas

## Documentação JSDoc

Todos os métodos possuem documentação JSDoc completa:

```javascript
/**
 * Carrega a lista de aulas da API
 * @async
 * @function
 */
const carregarAulas = async () => {
  // implementação
};

/**
 * Salva a aula (criar ou atualizar)
 * @async
 * @function
 */
const salvarAula = async () => {
  // implementação
};
```

## Critérios de Aceite Atendidos

✅ **CRUD Completo**: Create, Read, Update, Delete implementados
✅ **Campos Obrigatórios**: Todos os campos especificados são obrigatórios
✅ **UI Mobile**: Cards e formulários otimizados para mobile
✅ **Seletores**: Dropdowns para todas as entidades relacionadas
✅ **Multiseleção**: Blocos de horário com seleção múltipla
✅ **DatePicker**: DatePickers nativos para seleção intuitiva de datas
✅ **Filtros**: Busca por semestre, dia da semana e disciplina
✅ **Integração API**: Endpoints /api/v1/aulas utilizados
✅ **Tratamento 409**: Conflitos de horário tratados adequadamente
✅ **Tratamento 404**: IDs inexistentes tratados adequadamente
✅ **Localização**: Todas as mensagens em português brasileiro
✅ **JSDoc**: Documentação completa de todos os componentes