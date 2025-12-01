const express = require('express');
const {
  criarDisciplina,
  listarDisciplinas,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  removerDisciplina
} = require('../controllers/disciplinaController');

/**
 * @fileoverview Rotas para gerenciamento de disciplinas
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       required:
 *         - curso
 *         - nome
 *         - cargaHoraria
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único da disciplina
 *           example: "507f1f77bcf86cd799439011"
 *         curso:
 *           type: string
 *           description: ID do curso ao qual a disciplina pertence
 *           example: "507f1f77bcf86cd799439012"
 *         nome:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Nome da disciplina
 *           example: "Programação Orientada a Objetos"
 *         codigo:
 *           type: string
 *           description: Código da disciplina
 *           example: "POO001"
 *         cargaHoraria:
 *           type: number
 *           minimum: 1
 *           maximum: 1000
 *           description: Carga horária total da disciplina
 *           example: 80
 *         professorResponsavel:
 *           type: string
 *           description: ID do professor responsável
 *           example: "507f1f77bcf86cd799439013"
 *         status:
 *           type: boolean
 *           description: Status da disciplina (ativa/inativa)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *     DisciplinaInput:
 *       type: object
 *       required:
 *         - curso
 *         - nome
 *         - cargaHoraria
 *       properties:
 *         curso:
 *           type: string
 *           description: ID do curso
 *           example: "507f1f77bcf86cd799439012"
 *         nome:
 *           type: string
 *           description: Nome da disciplina
 *           example: "Programação Orientada a Objetos"
 *         codigo:
 *           type: string
 *           description: Código da disciplina
 *           example: "POO001"
 *         cargaHoraria:
 *           type: number
 *           description: Carga horária
 *           example: 80
 *         professorResponsavel:
 *           type: string
 *           description: ID do professor responsável
 *           example: "507f1f77bcf86cd799439013"
 *         status:
 *           type: boolean
 *           description: Status da disciplina
 *           example: true
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *         details:
 *           type: object
 *           description: Detalhes do erro
 */

/**
 * @swagger
 * /api/v1/disciplinas:
 *   post:
 *     summary: Cria uma nova disciplina
 *     tags: [Disciplinas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplinaInput'
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', criarDisciplina);

/**
 * @swagger
 * /api/v1/disciplinas:
 *   get:
 *     summary: Lista todas as disciplinas
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [true, false, Ativa, Inativa]
 *         description: Filtrar por status
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtrar por código (contém)
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
 *         description: Lista de disciplinas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 disciplinas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Disciplina'
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
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listarDisciplinas);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   get:
 *     summary: Busca uma disciplina por ID
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       200:
 *         description: Disciplina encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Disciplina não encontrada
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', buscarDisciplinaPorId);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   put:
 *     summary: Atualiza uma disciplina por ID
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplinaInput'
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Disciplina não encontrada
 *       400:
 *         description: Erro de validação ou ID inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', atualizarDisciplina);

/**
 * @swagger
 * /api/v1/disciplinas/{id}:
 *   delete:
 *     summary: Remove uma disciplina por ID
 *     tags: [Disciplinas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *     responses:
 *       204:
 *         description: Disciplina removida com sucesso
 *       404:
 *         description: Disciplina não encontrada
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', removerDisciplina);

module.exports = router;