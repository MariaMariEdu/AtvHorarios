@projeto @backend  
resposta: pt-br  

**Crie a implementação completa dos endpoints REST de Consulta de Horários para a entidade `aulas`.  
A resposta deve estar formatada em Markdown.**

**Tecnologias/Contexto:** Backend Node.js/Express + Mongoose  
**Idioma:** Português (pt-BR)

---

# 1. Objetivo da Funcionalidade (Consulta de Horários)

Criar no backend a camada de **Consulta/Relatórios** permitindo visualizar aulas filtradas por:

- laboratório  
- professor  
- curso  
- disciplina  
- intervalo de datas  
- semana específica (com cálculo automático de segunda a sábado)

Os resultados devem ser retornados já **populados** com nomes:

- nome da disciplina  
- nome do professor  
- nome do laboratório  
- nome do curso  
- blocos de horários  

---

# 2. Novos Endpoints da Consulta

### Base da rota:
`/api/v1/consultas`

---

# 3. Endpoint Principal – GET /api/v1/consultas/horarios  

Retorna aulas filtradas dinamicamente conforme parâmetros enviados.

## Query Params aceitos (todos opcionais):

| Parâmetro | Descrição |
|----------|-----------|
| `laboratorio` | filtrar por ID de laboratório |
| `professor` | filtrar por ID do professor |
| `curso` | filtrar por ID do curso |
| `disciplina` | filtrar por ID da disciplina |
| `dataInicio` | filtrar aulas com vigência >= dataInicio |
| `dataFim` | filtrar aulas com vigência <= dataFim |
| `semana` | data base (YYYY-MM-DD). O backend deve calcular a semana (Seg-Sáb) automaticamente |

---

# 4. Regras Internas Obrigatórias

### ✔ 1. Montar filtro dinâmico
O controller deve montar o filtro com base apenas nos parâmetros enviados.  
Exemplo:
```js
const filtro = {};

if (req.query.laboratorio) filtro.laboratorioId = req.query.laboratorio;
if (req.query.professor) filtro.professorId = req.query.professor;
if (req.query.curso) filtro.cursoId = req.query.curso;
if (req.query.disciplina) filtro.disciplinaId = req.query.disciplina;
