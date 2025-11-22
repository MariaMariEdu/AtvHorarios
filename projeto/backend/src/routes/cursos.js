const express = require('express');
const {
  criarCurso,
  listarCursos,
  buscarCursoPorId,
  atualizarCurso,
  removerCurso
} = require('../controllers/cursoController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - instituicaoid
 *         - nome
 *         - turno
 *       properties:
 *         instituicaoid:
 *           type: string
 *           description: ID da instituição
 *         nome:
 *           type: string
 *           description: Nome do curso
 *         turno:
 *           type: string
 *           enum: [Matutino, Vespertino, Noturno, Integral]
 *           description: Turno do curso
 *         status:
 *           type: boolean
 *           description: Status ativo/inativo
 *           default: true
 */

/**
 * @swagger
 * /api/v1/cursos:
 *   post:
 *     summary: Cria um novo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           example:
 *             instituicaoid: "507f1f77bcf86cd799439011"
 *             nome: "Engenharia de Software"
 *             turno: "Noturno"
 *             status: true
 *     responses:
 *       201:
 *         description: Curso criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarCurso);

/**
 * @swagger
 * /api/v1/cursos:
 *   get:
 *     summary: Lista todos os cursos
 *     tags: [Cursos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filtrar por status ativo
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: instituicaoid
 *         schema:
 *           type: string
 *         description: Filtrar por instituição
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get('/', listarCursos);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   get:
 *     summary: Busca um curso pelo ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *       404:
 *         description: Curso não encontrado
 */
router.get('/:id', buscarCursoPorId);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   put:
 *     summary: Atualiza um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso atualizado
 *       404:
 *         description: Curso não encontrado
 */
router.put('/:id', atualizarCurso);

/**
 * @swagger
 * /api/v1/cursos/{id}:
 *   delete:
 *     summary: Remove um curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do curso
 *     responses:
 *       204:
 *         description: Curso removido
 *       404:
 *         description: Curso não encontrado
 */
router.delete('/:id', removerCurso);

module.exports = router;