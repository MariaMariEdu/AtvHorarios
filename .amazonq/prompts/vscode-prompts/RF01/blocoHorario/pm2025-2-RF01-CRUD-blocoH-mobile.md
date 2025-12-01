@projeto @mobile

respostas: pt-br

1.) Implementação Mobile (Bloco de Horário):

    a) CRUD Bloco de Horário (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade **Bloco de Horário**.
        a.2) **Adaptação Mobile da UI:** Utilizar padrões adequados para dispositivos móveis, como listas (FlatList) ou cartões (Cards) para exibir os blocos de horário com informações como: nome do bloco, horário inicial, horário final, turno, duração, etc.
        a.3) **Interação:** O detalhe e o formulário de criação/edição de um bloco de horário devem ser acessíveis via navegação para uma nova tela, simulando um modal usado na web.
        a.4) Implementar funcionalidades de busca (Filter/Search) e ordenação (Sorting), garantindo facilidade de uso em telas menores.

    b) Integração:
        b.1) Integrar o módulo de Bloco de Horário com o endpoint **/api/v1/blocos-horarios** do backend.

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base `/api/v1/blocos-horarios`.
    * **GET:** A chamada GET `/api/v1/blocos-horarios` deve retornar um array JSON de blocos de horário (vazio se não houver registros).
    * **POST (Conflito):** A tentativa de POST com um **nome de bloco duplicado** deve retornar status 409 (Conflict) e mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** Operações PUT/DELETE com IDs que não existam devem retornar status 404 (Not Found).
    * **Localização:** Todas as mensagens retornadas pelo backend e exibidas no app mobile devem estar em português do Brasil (pt-BR).

3.) Documentação:
    * Gerar documentação e comentários JSDoc para todos os componentes mobile relacionados ao módulo de Bloco de Horário.
