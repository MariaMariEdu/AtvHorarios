@projeto @frontend

respostas em pt-br

1.) editar o componente src/component/Menu/Menu.jsx
    a) adicionar a opção **Consultas** no menu.
    b) configurar rotas (Router):
        b.1) ao selecionar **Consultas**, exibir o componente **Consultas** em um modal;
        b.2) incluir controles para fechar o modal (X e botão Fechar).

2.) criar o componente src/component/Consultas/Consultas.jsx

a.) funcionalidades:

    a.1) exibir no topo os filtros da tela de **Consultas de Horários**:

        - Select "Visão":
            * Laboratório
            * Professor

        - Select "Selecionar":
            * Se visão = Laboratório → carregar lista de laboratórios da API
            * Se visão = Professor → carregar lista de professores da API

        - Campo "Data Base" (Date), usado para montar a semana visualizada

        - Botão "Buscar" para executar a consulta

    a.2) ao clicar no botão Buscar:
        - chamar o endpoint GET /api/v1/aulas com filtros combinados:
            * ?laboratorio=ID
            * ?professor=ID
            * ?dataInicio=YYYY-MM-DD
            * ?dataFim=YYYY-MM-DD

    a.3) montar visualmente a **Grade Semanal**, em formato de tabela:
        - Colunas = dias da semana (Segunda a Sábado)
        - Linhas = blocos de horário cadastrados (Manhã 1… Noite 3)
        - Cada célula representa um cruzamento Dia/Bloco

    a.4) preenchimento da grade:
        - se houver aula no dia + bloco, exibir um Card com:
            * Nome da disciplina
            * Nome do professor   (quando a visão for laboratório)
            * Nome do laboratório (quando a visão for professor)

    a.5) lógica obrigatória:
        - carregar blocos existentes via GET /api/v1/blocos-horario
        - transformar o array plano retornado pela API em matriz de grade
        - manter a interface responsiva (Grid + Paper do MUI)

b) integrar o componente com os endpoints necessários:
    - GET /api/v1/aulas (com filtros)
    - GET /api/v1/professores
    - GET /api/v1/laboratorios
    - GET /api/v1/blocos-horario

3.) Critérios de aceitação

a.) A aplicação deve ser totalmente responsiva.
b.) O usuário deve conseguir consultar horários por:
        - laboratório
        - professor
        - semana específica
c.) A grade deve exibir corretamente:
        - disciplinas
        - professor ou laboratório (dependendo da visão)
d.) Filtros devem funcionar simultaneamente.
e.) A grade semanal deve renderizar corretamente mesmo com vários blocos e dias.

4.) Gerar documentação e comentários JSDoc

a.) adicionar JSDoc ao componente **Consultas.jsx**
b.) documentar estados, props e funções internas:
        - fetch de dados
        - montagem da grade
        - mapeamento de dias/blocos
        - tratamento dos filtros
c.) incluir descrição clara do fluxo da consulta e renderização
