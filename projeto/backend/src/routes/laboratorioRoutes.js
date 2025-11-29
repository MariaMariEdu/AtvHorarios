const express = require('express');
const {
  criarLaboratorio,
  listarLaboratorios,
  buscarLaboratorioPorId,
  atualizarLaboratorio,
  removerLaboratorio
} = require('../controllers/laboratorioController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Laboratorio:
 *       type: object
 *       required:
 *         - nome
 *         - codigo
 *         - capacidade
 *         - localizacao
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do laboratório
 *         nome:
 *           type: string
 *           description: Nome do laboratório
 *           maxLength: 100
 *         codigo:
 *           type: string
 *           description: Código único do laboratório
 *           maxLength: 20
 *         descricao:
 *           type: string
 *           description: Descrição do laboratório
 *           maxLength: 500
 *         capacidade:
 *           type: number
 *           description: Capacidade máxima de pessoas
 *           minimum: 1
 *           maximum: 200
 *         localizacao:
 *           type: string
 *           description: Localização do laboratório
 *           maxLength: 200
 *         equipamentos:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de equipamentos do laboratório
 *         status:
 *           type: boolean
 *           description: Status do laboratório (ativo/inativo)
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
 *         nome: "Laboratório de Informática 1"
 *         codigo: "LAB001"
 *         descricao: "Laboratório equipado com 30 computadores"
 *         capacidade: 30
 *         localizacao: "Bloco A - Sala 101"
 *         equipamentos: ["Computadores", "Projetor", "Quadro Digital"]
 *         status: true
 */

/**
 * @swagger
 * /api/v1/laboratorios:
 *   post:
 *     summary: Cria um novo laboratório
 *     tags: [Laboratórios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laboratorio'
 *     responses:
 *       201:
 *         description: Laboratório criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratorio'
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Código do laboratório já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', criarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios:
 *   get:
 *     summary: Lista todos os laboratórios
 *     tags: [Laboratórios]
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
 *         name: localizacao
 *         schema:
 *           type: string
 *         description: Filtrar por localização (contém)
 *       - in: query
 *         name: capacidadeMin
 *         schema:
 *           type: number
 *         description: Capacidade mínima
 *       - in: query
 *         name: capacidadeMax
 *         schema:
 *           type: number
 *         description: Capacidade máxima
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de laboratórios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Laboratorio'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', listarLaboratorios);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   get:
 *     summary: Busca um laboratório por ID
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     responses:
 *       200:
 *         description: Laboratório encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratorio'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Laboratório não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', buscarLaboratorioPorId);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   put:
 *     summary: Atualiza um laboratório por ID
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laboratorio'
 *     responses:
 *       200:
 *         description: Laboratório atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Laboratorio'
 *       400:
 *         description: Erro de validação ou ID inválido
 *       404:
 *         description: Laboratório não encontrado
 *       409:
 *         description: Código do laboratório já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', atualizarLaboratorio);

/**
 * @swagger
 * /api/v1/laboratorios/{id}:
 *   delete:
 *     summary: Remove um laboratório por ID
 *     tags: [Laboratórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *     responses:
 *       204:
 *         description: Laboratório removido com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Laboratório não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', removerLaboratorio);

module.exports = router;