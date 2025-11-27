@projeto @mobile

respostas: pt-br

1.) Implementação Mobile (Instituições):

    a) CRUD Instituições (Recursos):
        a.1) Desenvolver a funcionalidade CRUD completa para a entidade Instituições.
        a.2) **Adaptação Mobile da UI:** Utilizar o padrão de interface de listas (ListView) ou cartões (Cards) para a exibição das instituições, ideal para dispositivos móveis, em vez de um grid tradicional.
        a.3) **Interação:** O detalhe e formulário de edição/inserção de uma instituição deve ser acessível via navegação para uma nova tela, simulando o comportamento de um modal da web.
        a.4) As funcionalidades de busca (Filter/Search) e ordenação (Sorting) devem ser intuitivas e funcionais para telas menores.

    b) Integração:
        b.1) Integrar o componente de Instituições com o endpoint **instituicoes**.

2.) Critérios de Aceite (Backend & Localização):

    * **Endpoints:** Utilizar a URL base `/api/v1/instituicoes`.
    * **GET:** A chamada GET `/api/v1/instituicoes` deve retornar um array JSON de instituições (vazio se não houver registros).
    * **POST (Conflito):** A tentativa de POST com o **CNPJ** (ou chave única) repetido deve retornar status 409 (Conflict) e uma mensagem clara em pt-BR.
    * **PUT/DELETE (Não Encontrado):** Operações PUT/DELETE com IDs inexistentes devem retornar status 404 (Not Found).
    * **Localização:** Todas as respostas do backend e mensagens de erro exibidas no frontend devem estar em pt-BR.

3.) Documentação:
    * Gerar documentação e comentários JSDoc para todos os componentes mobile.
```
