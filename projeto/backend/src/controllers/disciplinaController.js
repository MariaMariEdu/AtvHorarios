const Disciplina = require('../models/Disciplina');

/**
 * @fileoverview Controller para gerenciamento de disciplinas
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Cria uma nova disciplina
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Disciplina criada
 */
const criarDisciplina = async (req, res) => {
  try {
    const disciplina = new Disciplina(req.body);
    const disciplinaSalva = await disciplina.save();
    res.status(201).json(disciplinaSalva);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erro de validação',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Código da disciplina já existe',
        details: 'Este código já está sendo usado por outra disciplina'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista todas as disciplinas com filtros opcionais
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Array>} Lista de disciplinas
 */
const listarDisciplinas = async (req, res) => {
  try {
    const { status, nome, codigo, page = 1, limit = 20 } = req.query;
    const filtros = {};

    if (status !== undefined) {
      if (status === 'true' || status === 'Ativa') {
        filtros.status = true;
      } else if (status === 'false' || status === 'Inativa') {
        filtros.status = false;
      }
    }

    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }

    if (codigo) {
      filtros.codigo = { $regex: codigo, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const disciplinas = await Disciplina.find(filtros)
      .populate('curso', 'nome')
      .populate('professorResponsavel', 'nome email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    const total = await Disciplina.countDocuments(filtros);

    // Para compatibilidade com mobile, retorna array direto
    res.json(disciplinas);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Busca uma disciplina por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Disciplina encontrada
 */
const buscarDisciplinaPorId = async (req, res) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id)
      .populate('curso', 'nome')
      .populate('professorResponsavel', 'nome email');

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.json(disciplina);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID inválido',
        details: 'O ID fornecido não é um ObjectId válido'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Atualiza uma disciplina por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Disciplina atualizada
 */
const atualizarDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('curso', 'nome')
     .populate('professorResponsavel', 'nome email');

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.json(disciplina);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erro de validação',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Código da disciplina já existe',
        details: 'Este código já está sendo usado por outra disciplina'
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID inválido',
        details: 'O ID fornecido não é um ObjectId válido'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Remove uma disciplina por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Status de remoção
 */
const removerDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);

    if (!disciplina) {
      return res.status(404).json({
        message: 'Disciplina não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'ID inválido',
        details: 'O ID fornecido não é um ObjectId válido'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

module.exports = {
  criarDisciplina,
  listarDisciplinas,
  buscarDisciplinaPorId,
  atualizarDisciplina,
  removerDisciplina
};