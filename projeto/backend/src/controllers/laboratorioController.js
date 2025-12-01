const Laboratorio = require('../models/Laboratorio');

/**
 * @fileoverview Controller para gerenciamento de laboratórios
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Cria um novo laboratório
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Laboratório criado
 */
const criarLaboratorio = async (req, res) => {
  try {
    const laboratorio = new Laboratorio(req.body);
    const laboratorioSalvo = await laboratorio.save();
    res.status(201).json(laboratorioSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erro de validação',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Código do laboratório já existe',
        details: 'Este código já está sendo usado por outro laboratório'
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista todos os laboratórios com filtros opcionais
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Array>} Lista de laboratórios
 */
const listarLaboratorios = async (req, res) => {
  try {
    const { status, nome, localizacao, capacidadeMin, capacidadeMax, page = 1, limit = 20 } = req.query;
    const filtros = {};

    if (status !== undefined) {
      if (status === 'true' || status === 'Ativo') {
        filtros.status = true;
      } else if (status === 'false' || status === 'Inativo') {
        filtros.status = false;
      }
    }

    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }

    if (localizacao) {
      filtros.localizacao = { $regex: localizacao, $options: 'i' };
    }

    if (capacidadeMin || capacidadeMax) {
      filtros.capacidade = {};
      if (capacidadeMin) filtros.capacidade.$gte = parseInt(capacidadeMin);
      if (capacidadeMax) filtros.capacidade.$lte = parseInt(capacidadeMax);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const laboratorios = await Laboratorio.find(filtros)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ nome: 1 });

    res.json(laboratorios);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Busca um laboratório por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Laboratório encontrado
 */
const buscarLaboratorioPorId = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findById(req.params.id);

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.json(laboratorio);
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
 * Atualiza um laboratório por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<Object>} Laboratório atualizado
 */
const atualizarLaboratorio = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
      });
    }

    res.json(laboratorio);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Erro de validação',
        details: error.errors
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Código do laboratório já existe',
        details: 'Este código já está sendo usado por outro laboratório'
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
 * Remove um laboratório por ID
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @returns {Promise<void>} Status de remoção
 */
const removerLaboratorio = async (req, res) => {
  try {
    const laboratorio = await Laboratorio.findByIdAndDelete(req.params.id);

    if (!laboratorio) {
      return res.status(404).json({
        message: 'Laboratório não encontrado'
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
  criarLaboratorio,
  listarLaboratorios,
  buscarLaboratorioPorId,
  atualizarLaboratorio,
  removerLaboratorio
};