const express = require('express');
const router = express.Router();
const { consultarHorarios } = require('../controllers/consultaController');

/**
 * @swagger
 * /api/v1/consultas/horarios:
 *   get:
 *     summary: Consultar horários de aulas com filtros dinâmicos
 *     tags: [Consultas]
 *     parameters:
 *       - in: query
 *         name: laboratorio
 *         schema:
 *           type: string
 *         description: ID do laboratório
 *       - in: query
 *         name: professor
 *         schema:
 *           type: string
 *         description: ID do professor
 *       - in: query
 *         name: curso
 *         schema:
 *           type: string
 *         description: ID do curso
 *       - in: query
 *         name: disciplina
 *         schema:
 *           type: string
 *         description: ID da disciplina
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *       - in: query
 *         name: semana
 *         schema:
 *           type: string
 *           format: date
 *         description: Data base para calcular semana (Segunda a Sábado)
 *     responses:
 *       200:
 *         description: Lista de aulas filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 filtros:
 *                   type: object
 *                 aulas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Aula'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/horarios', consultarHorarios);

module.exports = router;