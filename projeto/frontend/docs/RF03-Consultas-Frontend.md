# RF03 - Consultas de Horários - Frontend

## Implementação Completa da Interface de Consultas

### 1. Componente Menu.jsx - Atualizado

#### Modificações Realizadas:
- ✅ Adicionado ícone `SearchIcon` para consultas
- ✅ Importado componente `Consultas`
- ✅ Criado handler `handleConsultasClick()`
- ✅ Adicionado item de menu "Consultas" com modal

### 2. Componente Consultas.jsx - Criado

#### Estados Gerenciados:
```javascript
// Filtros
const [visao, setVisao] = useState('');           // 'laboratorio' ou 'professor'
const [selecionado, setSelecionado] = useState(''); // ID da entidade selecionada
const [dataBase, setDataBase] = useState('');       // Data para cálculo da semana

// Dados das APIs
const [laboratorios, setLaboratorios] = useState([]);
const [professores, setProfessores] = useState([]);
const [blocosHorario, setBlocosHorario] = useState([]);
const [aulas, setAulas] = useState([]);
```

#### Funcionalidades Implementadas:

##### a) Filtros no Topo:
- **Select "Visão"**: Laboratório ou Professor
- **Select "Selecionar"**: Lista dinâmica baseada na visão
- **Campo "Data Base"**: Input tipo date para semana
- **Botão "Buscar"**: Executa consulta com filtros

##### b) Cálculo Automático de Semana:
```javascript
const calcularSemana = (data) => {
  const dataObj = new Date(data);
  const diaSemana = dataObj.getDay();
  const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  // ... lógica de cálculo
};
```

##### c) Grade Semanal Visual:
- **Colunas**: Dias da semana (Segunda a Sábado)
- **Linhas**: Blocos de horário cadastrados
- **Células**: Cards com disciplina e professor/laboratório

### 3. Endpoints Integrados

- ✅ `GET /api/v1/aulas` - Busca aulas com filtros
- ✅ `GET /api/v1/professores` - Lista professores
- ✅ `GET /api/v1/laboratorios` - Lista laboratórios  
- ✅ `GET /api/v1/blocos-horario` - Lista blocos de horário

### 4. Critérios de Aceitação - Atendidos

✅ **Aplicação totalmente responsiva**  
✅ **Consulta por laboratório e professor**  
✅ **Consulta por semana específica**  
✅ **Grade exibe disciplinas e entidades**  
✅ **Filtros funcionam simultaneamente**  
✅ **Grade renderiza com múltiplos blocos/dias**  

### 5. Arquivos Criados/Modificados

#### Novos Arquivos:
- `src/components/Consultas/Consultas.jsx` - Componente principal
- `docs/RF03-Consultas-Frontend.md` - Esta documentação

#### Arquivos Modificados:
- `src/components/Menu/Menu.jsx` - Adicionada opção Consultas