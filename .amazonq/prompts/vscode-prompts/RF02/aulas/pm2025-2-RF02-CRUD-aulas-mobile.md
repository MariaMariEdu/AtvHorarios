@projeto @mobile

respostas: pt-br

1.) Implementação Mobile (Aulas):

    a) CRUD Aulas (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade **Aulas**, contemplando os seguintes campos obrigatórios:
            • semestre: String
            • cursoId: ObjectId
            • disciplinaId: ObjectId
            • professorId: ObjectId
            • laboratorioId: ObjectId
            • diaSemana: String
            • blocos: [ObjectId] – lista de blocos de horário
            • dataInicio: Date
            • dataFim: Date

        a.2) **Adaptação Mobile da UI:** Utilizar ListView ou Cards para exibir as aulas em formato compacto e eficiente, com destaque para semestre, disciplina e professor.

        a.3) **Formulário de Edição/Inserção:** A criação e edição de uma aula deve acontecer em uma nova tela, seguindo o padrão mobile. Validar todos os campos obrigatórios antes de enviar.

        a.4) **Busca e Filtros:** Implementar busca por semestre, dia da semana e disciplina. Os filtros devem ser simples e adequados para telas menores.

        a.5) **Seletores:** Utilizar dropdowns ou pickers para cursoId, disciplinaId, professorId, laboratorioId e blocos (multiseleção).

        a.6) **Datas:** Usar DatePicker para dataInicio e dataFim, garantindo seleção intuitiva.

    b) Integração:
        b.1) Integrar todo o módulo com o endpoint **aulas**.
        b.2) Garantir que o envio dos ObjectIds siga o formato correto esperado pelo backend.
        b.3) Normalizar os dados recebidos para exibição (ex.: nomes de curso, professor, laboratório).

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base /api/v1/aulas.
    * **GET:** GET /api/v1/aulas deve retornar um array JSON com a lista de aulas (ou vazio).
    * **POST (Conflito):** Caso exista conflito como sobreposição de horário/bloco/laboratório, retornar status 409 (Conflict) com mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** Caso o ID informado não exista, retornar status 404 (Not Found).
    * **Validação:** Todos os campos devem ser obrigatórios; enviar erro objetivo e claro em pt-BR.
    * **Localização:** Todo retorno do backend, incluindo mensagens de erro, deve estar em português do Brasil.

3.) Documentação:

    * Gerar documentação e comentários utilizando JSDoc para todos os componentes mobile ligados ao módulo de Aulas.
    * Especificar tipos, fluxos, validações e comportamento esperado do formulário.

