const express = require('express');
const {
  criarProfessor,
  listarProfessores,
  buscarProfessor,
  atualizarProfessor,
  removerProfessor
} = require('../controllers/professorController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Professor:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do professor
 *         nome:
 *           type: string
 *           description: Nome completo do professor
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail institucional do professor (único)
 *         telefone:
 *           type: string
 *           description: Telefone de contato do professor
 *           maxLength: 20
 *         status:
 *           type: boolean
 *           description: Status do professor (ativo/inativo)
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         nome: "João Silva"
 *         email: "joao.silva@universidade.edu.br"
 *         telefone: "(11) 99999-9999"
 *         status: true
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *         updatedAt: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/v1/professores:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Professores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Santos"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "maria.santos@universidade.edu.br"
 *               telefone:
 *                 type: string
 *                 example: "(11) 88888-8888"
 *               status:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       400:
 *         description: Dados inválidos ou email já em uso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', criarProfessor);

/**
 * @swagger
 * /api/v1/professores:
 *   get:
 *     summary: Lista todos os professores
 *     tags: [Professores]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [true, false, Ativo, Inativo]
 *         description: Filtrar por status
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (contém)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email (contém)
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
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listarProfessores);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   get:
 *     summary: Busca um professor por ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', buscarProfessor);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   put:
 *     summary: Atualiza um professor por ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefone:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', atualizarProfessor);

/**
 * @swagger
 * /api/v1/professores/{id}:
 *   delete:
 *     summary: Remove um professor por ID
 *     tags: [Professores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do professor
 *     responses:
 *       204:
 *         description: Professor removido com sucesso
 *       404:
 *         description: Professor não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', removerProfessor);

module.exports = router;