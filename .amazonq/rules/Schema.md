1. Nunca gerar o mesmo Schema Mongoose mais de uma vez.
2. Nunca repetir campos já declarados em um schema.
3. Nunca declarar índices duplicados. Escolher apenas UM dos métodos:
   - OU usar "index: true" no campo
   - OU usar "schema.index({ campo: 1 })"
   Mas nunca os dois juntos.
4. Nunca gerar o mesmo modelo (mongoose.model) mais de uma vez.
5. Caso o schema já tenha sido criado anteriormente no projeto, não recriar. Apenas referenciar.
6. Não reescrever schemas, modelos ou arquivos inteiros, a menos que seja explicitamente solicitado.
7. Se necessário atualizar o schema, modificar apenas a parte solicitada, sem duplicações.
8. Sempre verificar antes de gerar um novo schema se o arquivo já contém definições de index, model ou campos equivalentes.
