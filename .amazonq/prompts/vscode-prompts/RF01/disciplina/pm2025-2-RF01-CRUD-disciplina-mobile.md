@projeto @mobile 

respostas: pt-br

1.) Implementação Mobile (Disciplinas):

    a) CRUD Disciplinas (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade **Disciplinas**.
        a.2) **Adaptação Mobile da UI:** Utilizar listas (FlatList) ou cartões (Cards) para exibir as disciplinas, garantindo boa usabilidade em dispositivos móveis.
        a.3) **Interação:** A visualização detalhada e o formulário de edição/criação de uma disciplina devem abrir em uma nova tela, simulando o comportamento de modal da versão web.
        a.4) As funcionalidades de busca (Filter/Search) e ordenação (Sorting) devem ser responsivas, intuitivas e otimizadas para telas pequenas.

    b) Integração:
        b.1) Integrar o componente de Disciplinas com o endpoint **disciplinas**.

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base `/api/v1/disciplinas`.
    * **GET:** A chamada GET `/api/v1/disciplinas` deve retornar um array JSON de disciplinas (vazio se não houver registros).
    * **POST (Conflito):** A tentativa de POST com o **código** repetido deve retornar status 409 (Conflict) e uma mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** Operações PUT/DELETE com IDs inexistentes devem retornar status 404 (Not Found).
    * **Localização:** Todas as respostas do backend e mensagens exibidas no app mobile devem estar em pt-BR.

3.) Documentação:
    * Gerar documentação e comentários JSDoc para todos os componentes mobile relacionados a Disciplinas.

