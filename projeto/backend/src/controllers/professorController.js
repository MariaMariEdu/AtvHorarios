const Professor = require('../models/Professor');

/**
 * @fileoverview Controller para gerenciamento de professores
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Cria um novo professor
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const criarProfessor = async (req, res) => {
  try {
    const professor = new Professor(req.body);
    const professorSalvo = await professor.save();
    res.status(201).json(professorSalvo);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email já está em uso',
        details: { email: 'Este email já está cadastrado' }
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.errors
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: {}
    });
  }
};

/**
 * Lista todos os professores com filtros e paginação
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const listarProfessores = async (req, res) => {
  try {
    const { status, nome, email, page = 1, limit = 20 } = req.query;
    const filtros = {};

    if (status !== undefined) {
      filtros.status = status === 'true' || status === 'Ativo';
    }
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    if (email) {
      filtros.email = { $regex: email, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const professores = await Professor.find(filtros)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(professores);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: {}
    });
  }
};

/**
 * Busca um professor por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const buscarProfessor = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado',
        details: {}
      });
    }
    res.json(professor);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: {}
    });
  }
};

/**
 * Atualiza um professor por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const atualizarProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado',
        details: {}
      });
    }
    res.json(professor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email já está em uso',
        details: { email: 'Este email já está cadastrado' }
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.errors
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: {}
    });
  }
};

/**
 * Remove um professor por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>}
 */
const removerProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado',
        details: {}
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: {}
    });
  }
};

module.exports = {
  criarProfessor,
  listarProfessores,
  buscarProfessor,
  atualizarProfessor,
  removerProfessor
};