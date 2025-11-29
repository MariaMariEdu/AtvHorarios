const BlocoHorario = require('../models/BlocoHorario');

/**
 * @fileoverview Controller para gerenciamento de Blocos de Horário
 * @description Implementa operações CRUD para blocos de horário
 */

/**
 * Cria um novo bloco de horário
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @returns {Promise<void>}
 */
const criarBlocoHorario = async (req, res) => {
  try {
    const blocoHorario = new BlocoHorario(req.body);
    const blocoSalvo = await blocoHorario.save();
    res.status(201).json(blocoSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.errors
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista todos os blocos de horário com filtros opcionais
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @returns {Promise<void>}
 */
const listarBlocosHorario = async (req, res) => {
  try {
    const { turno, diaSemana, page = 1, limit = 20 } = req.query;
    const filtros = {};

    if (turno) filtros.turno = new RegExp(turno, 'i');
    if (diaSemana) filtros.diaSemana = new RegExp(diaSemana, 'i');

    const skip = (page - 1) * limit;
    const blocos = await BlocoHorario.find(filtros)
      .sort({ turno: 1, diaSemana: 1, ordem: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BlocoHorario.countDocuments(filtros);

    res.json({
      blocos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Busca um bloco de horário por ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @returns {Promise<void>}
 */
const buscarBlocoHorarioPorId = async (req, res) => {
  try {
    const bloco = await BlocoHorario.findById(req.params.id);
    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco de horário não encontrado'
      });
    }
    res.json(bloco);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Atualiza um bloco de horário por ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @returns {Promise<void>}
 */
const atualizarBlocoHorario = async (req, res) => {
  try {
    const bloco = await BlocoHorario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco de horário não encontrado'
      });
    }
    
    res.json(bloco);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.errors
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Remove um bloco de horário por ID
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @returns {Promise<void>}
 */
const removerBlocoHorario = async (req, res) => {
  try {
    const bloco = await BlocoHorario.findByIdAndDelete(req.params.id);
    if (!bloco) {
      return res.status(404).json({
        message: 'Bloco de horário não encontrado'
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

module.exports = {
  criarBlocoHorario,
  listarBlocosHorario,
  buscarBlocoHorarioPorId,
  atualizarBlocoHorario,
  removerBlocoHorario
};