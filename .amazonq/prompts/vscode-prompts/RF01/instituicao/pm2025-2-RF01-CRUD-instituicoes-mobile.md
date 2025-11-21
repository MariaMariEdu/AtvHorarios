@projeto @mobile

respostas: pt-br

1.) criar a aplicação mobile:
    a) react native
    b) CRUD Instituições
       b.1) idêntico ao CRUD Web @frontend
       b.2) usar o mesmo padrão de interface 
    c) mesmo modelo de interação da web
    d) mesmas funcionalidade da web

2)Critérios de aceite
    GET /api/v1/instituicoes retorna array JSON (vazio se não houver registros).
    POST com CNPJ repetido retorna 409 e mensagem clara em pt-BR.
    PUT/DELETE com id inexistente retornam 404.
    Respostas e mensagens em pt-BR.