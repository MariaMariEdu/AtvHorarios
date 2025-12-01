@projeto @frontend

respostas em pt-br

1.) editar o componente src/component/Menu/Menu.jsx
    a) rotear componentes (Router).
        a.1) ao selecionar **Aulas**, exibir o componente **Aulas** em um modal;
        a.2) incluir controles para fechar o modal (X e botão Fechar).

2.) criar o componente src/component/Aulas/Aulas.jsx
a.) funcionalidades:
    a.1) exibir um grid mostrando todas as **Aulas** cadastradas, com controles CRUD:
        - inserir nova aula
        - editar aula existente
        - excluir aula
    a.2) ao clicar no cabeçalho das colunas, ordenar o conteúdo do grid (Sorting).
    a.3) permitir filtrar/pesquisar aulas por:
        - semestre
        - curso
        - disciplina
        - professor
        - laboratório
        - dia da semana
    a.4) validar campos obrigatórios no formulário de criação e edição:
        - semestre
        - cursoId
        - disciplinaId
        - professorId
        - laboratorioId
        - diaSemana
        - blocos (array de blocos já cadastrados)
        - dataInicio
        - dataFim
    a.5) exibir mensagens de erro claras quando o backend retornar conflitos:
        - laboratório já ocupado no mesmo horário
        - professor com choque de horário

b) integrar o componente com o endpoint **aulas**:
    - GET /api/v1/aulas
    - POST /api/v1/aulas
    - PUT /api/v1/aulas/:id
    - DELETE /api/v1/aulas/:id

3.) Critérios de aceitação
a.) A aplicação deve ser responsiva.
b.) O usuário deve conseguir visualizar, criar, editar e excluir aulas.
c.) Em caso de conflito de horários, o modal deve exibir a mensagem retornada pelo backend.
d.) Ordenação e filtros devem funcionar simultaneamente no grid.

4.) Gerar documentação e comentários JSDoc
a.) adicionar JSDoc nos componentes React
b.) documentar funções internas (fetch, helpers, validações)
c.) documentar props e estados usados no componente Aulas

