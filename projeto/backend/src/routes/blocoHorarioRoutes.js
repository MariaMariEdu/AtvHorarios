const express = require('express');
const {
  criarBlocoHorario,
  listarBlocosHorario,
  buscarBlocoHorarioPorId,
  atualizarBlocoHorario,
  removerBlocoHorario
} = require('../controllers/blocoHorarioController');

/**
 * @fileoverview Rotas para gerenciamento de Blocos de Horário
 * @description Define as rotas REST para operações CRUD de blocos de horário
 */

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BlocoHorario:
 *       type: object
 *       required:
 *         - turno
 *         - diaSemana
 *         - inicio
 *         - fim
 *         - ordem
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do bloco de horário
 *         turno:
 *           type: string
 *           description: Turno do bloco
 *           example: "Manhã"
 *         diaSemana:
 *           type: string
 *           description: Dia da semana
 *           example: "Segunda"
 *         inicio:
 *           type: string
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de início (HH:MM)
 *           example: "08:00"
 *         fim:
 *           type: string
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Horário de fim (HH:MM)
 *           example: "09:50"
 *         ordem:
 *           type: number
 *           minimum: 1
 *           description: Ordem do bloco dentro do turno
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/blocos-horario:
 *   post:
 *     summary: Cria um novo bloco de horário
 *     tags: [Blocos de Horário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - turno
 *               - diaSemana
 *               - inicio
 *               - fim
 *               - ordem
 *             properties:
 *               turno:
 *                 type: string
 *                 example: "Manhã"
 *               diaSemana:
 *                 type: string
 *                 example: "Segunda"
 *               inicio:
 *                 type: string
 *                 example: "08:00"
 *               fim:
 *                 type: string
 *                 example: "09:50"
 *               ordem:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Bloco de horário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlocoHorario'
 *       400:
 *         description: Dados inválidos
 */
router.post('/', criarBlocoHorario);

/**
 * @swagger
 * /api/v1/blocos-horario:
 *   get:
 *     summary: Lista todos os blocos de horário
 *     tags: [Blocos de Horário]
 *     parameters:
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *         description: Filtrar por turno
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
 *         description: Lista de blocos de horário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blocos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlocoHorario'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', listarBlocosHorario);

/**
 * @swagger
 * /api/v1/blocos-horario/{id}:
 *   get:
 *     summary: Busca um bloco de horário por ID
 *     tags: [Blocos de Horário]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco de horário
 *     responses:
 *       200:
 *         description: Bloco de horário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlocoHorario'
 *       404:
 *         description: Bloco de horário não encontrado
 */
router.get('/:id', buscarBlocoHorarioPorId);

/**
 * @swagger
 * /api/v1/blocos-horario/{id}:
 *   put:
 *     summary: Atualiza um bloco de horário
 *     tags: [Blocos de Horário]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco de horário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno:
 *                 type: string
 *               diaSemana:
 *                 type: string
 *               inicio:
 *                 type: string
 *               fim:
 *                 type: string
 *               ordem:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bloco de horário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlocoHorario'
 *       404:
 *         description: Bloco de horário não encontrado
 *       400:
 *         description: Dados inválidos
 */
router.put('/:id', atualizarBlocoHorario);

/**
 * @swagger
 * /api/v1/blocos-horario/{id}:
 *   delete:
 *     summary: Remove um bloco de horário
 *     tags: [Blocos de Horário]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do bloco de horário
 *     responses:
 *       204:
 *         description: Bloco de horário removido com sucesso
 *       404:
 *         description: Bloco de horário não encontrado
 */
router.delete('/:id', removerBlocoHorario);

module.exports = router;