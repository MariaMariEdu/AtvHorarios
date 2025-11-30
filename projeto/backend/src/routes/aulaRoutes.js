const express = require('express');
const {
  criarAula,
  listarAulas,
  buscarAulaPorId,
  atualizarAula,
  removerAula
} = require('../controllers/aulaController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Aula:
 *       type: object
 *       required:
 *         - semestre
 *         - cursoId
 *         - disciplinaId
 *         - professorId
 *         - laboratorioId
 *         - diaSemana
 *         - blocos
 *         - dataInicio
 *         - dataFim
 *       properties:
 *         semestre:
 *           type: string
 *           description: Semestre letivo
 *           example: "2025/1"
 *         cursoId:
 *           type: string
 *           description: ID do curso
 *         disciplinaId:
 *           type: string
 *           description: ID da disciplina
 *         professorId:
 *           type: string
 *           description: ID do professor
 *         laboratorioId:
 *           type: string
 *           description: ID do laboratório
 *         diaSemana:
 *           type: string
 *           enum: [Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira, Sábado, Domingo]
 *           description: Dia da semana da aula
 *         blocos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de IDs dos blocos de horário
 *         dataInicio:
 *           type: string
 *           format: date-time
 *           description: Data de início da aula
 *           example: "2025-11-30T08:00:00.000Z"
 *         dataFim:
 *           type: string
 *           format: date-time
 *           description: Data de fim da aula
 *           example: "2025-11-30T18:00:00.000Z"
 *     ConflitError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Conflito de horário"
 *         details:
 *           type: object
 *           properties:
 *             tipo:
 *               type: string
 *               enum: [laboratorio, professor]
 *             diaSemana:
 *               type: string
 *             blocos:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/v1/aulas:
 *   post:
 *     summary: Criar nova aula
 *     tags: [Aulas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *     responses:
 *       201:
 *         description: Aula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Conflito de horário ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflitError'
 */
router.post('/', criarAula);

/**
 * @swagger
 * /api/v1/aulas:
 *   get:
 *     summary: Listar aulas
 *     tags: [Aulas]
 *     parameters:
 *       - in: query
 *         name: cursoId
 *         schema:
 *           type: string
 *         description: Filtrar por curso
 *       - in: query
 *         name: professorId
 *         schema:
 *           type: string
 *         description: Filtrar por professor
 *       - in: query
 *         name: disciplinaId
 *         schema:
 *           type: string
 *         description: Filtrar por disciplina
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *         description: Filtrar por semestre
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *         description: Filtrar por dia da semana
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
 *         description: Lista de aulas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aula'
 */
router.get('/', listarAulas);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   get:
 *     summary: Buscar aula por ID
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       200:
 *         description: Aula encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       404:
 *         description: Aula não encontrada
 */
router.get('/:id', buscarAulaPorId);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   put:
 *     summary: Atualizar aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aula'
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aula'
 *       400:
 *         description: Conflito de horário ou erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflitError'
 *       404:
 *         description: Aula não encontrada
 */
router.put('/:id', atualizarAula);

/**
 * @swagger
 * /api/v1/aulas/{id}:
 *   delete:
 *     summary: Remover aula
 *     tags: [Aulas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da aula
 *     responses:
 *       204:
 *         description: Aula removida com sucesso
 *       404:
 *         description: Aula não encontrada
 */
router.delete('/:id', removerAula);

module.exports = router;