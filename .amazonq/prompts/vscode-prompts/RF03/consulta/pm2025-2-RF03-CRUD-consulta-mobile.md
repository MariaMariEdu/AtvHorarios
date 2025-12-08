@projeto @mobile
respostas: pt-br

prompt: |
  Desenvolva a implementação completa da funcionalidade **Consultas de Aulas** no aplicativo mobile.

  O objetivo é permitir que o usuário visualize horários por:
  • laboratório
  • curso
  • disciplina
  • professor

  Toda a **interface de exibição deve seguir o estilo visual da imagem enviada**:
  → Grade organizada por dias da semana, horários e blocos.
  → Cartões coloridos, retangulares, alinhados em grade.
  → Layout semelhante a um quadro de horários, como o exemplo do “Laboratório 1 (20 computadores)” da imagem.
  → Cada bloco deve conter: disciplina, professor, curso e horário.
  → Exibir de forma responsiva para mobile usando ScrollView + Grid/Layout flexível.

  1. Implementação Mobile — Consultas (Aulas)


  1.1) Tela de Consultas:
    • Criar uma tela dedicada chamada **Consultas**.
    • Permitir consultar aulas por:
      - laboratórioId
      - cursoId
      - disciplinaId
      - professorId

  1.2) Exibição:
    • Criar uma grade visual parecida com o quadro de horários.
    • Linhas representam horários (blocos).
    • Colunas representam dias da semana.
    • Cada aula deve ser renderizada como um card colorido ocupando o(s) bloco(s) correspondente(s).
    • Usar cores diferentes para disciplinas diferentes (ou categorias).
    • O card deve exibir:
      - Nome da disciplina
      - Nome do professor
      - Curso
      - Horário (bloco → faixa de horário)
    • Layout responsivo usando:
      - ScrollView horizontal e vertical
      - Flexbox ou grid system interno

  1.3) Filtros da Tela:
    • Dropdowns/pickers para:
      - Curso
      - Disciplina
      - Professor
      - Laboratório
      - Dia da semana (opcional)
    • Campo de busca opcional por nome de disciplina/professor.
 
  2. Integração

  • Base URL: /api/v1/aulas
  • GET /api/v1/aulas
    - Deve retornar a lista de aulas utilizadas para renderizar a grade.
  • Filtragem deve ser enviada como query params.
  • Normalizar dados recebidos para exibir nomes (curso, disciplina, laboratório, professor).

  • Regras de retorno do backend:
    - Erro 409 para conflito de horário/bloco/lab.
    - Erro 404 para recurso não encontrado.
    - Todas mensagens retornadas devem estar em português do Brasil.

  3. Estrutura esperada da entidade (para consumo da API)

  Cada aula possui:
    • semestre: String
    • cursoId: ObjectId
    • disciplinaId: ObjectId
    • professorId: ObjectId
    • laboratorioId: ObjectId
    • diaSemana: String
    • blocos: [ObjectId]
    • dataInicio: Date
    • dataFim: Date

  4. Documentação


  • Gerar documentação JSDoc para:
      - Tela de Consultas
      - Componentes de grade de horários
      - Componentes de filtros (dropdowns/pickers)
      - Serviços de acesso à API (GET)
      - Funções de normalização e transformação dos dados

  • Documentar:
      - Tipos
      - Fluxos
      - Validações
      - Como os blocos são convertidos em posições na grade
      - Comportamento esperado da renderização visual

  IMPORTANTE

  → A exibição deve seguir fielmente:
      - Grade por dia da semana
      - Divisão por horários/blocos
      - Cartões coloridos
      - Layout compacto e organizado para mobile
      - Scroll horizontal e vertical
