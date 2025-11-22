const { Curso } = require('../models');

/**
 * Cria um novo curso
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
const criarCurso = async (req, res) => {
  try {
    const curso = new Curso(req.body);
    const cursoSalvo = await curso.save();
    res.status(201).json(cursoSalvo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Lista todos os cursos com filtros opcionais
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
const listarCursos = async (req, res) => {
  try {
    const { status, nome, instituicaoid, page = 1, limit = 20 } = req.query;
    const filtros = {};

    if (status !== undefined) {
      filtros.status = status === 'true';
    }
    if (nome) {
      filtros.nome = { $regex: nome, $options: 'i' };
    }
    if (instituicaoid) {
      filtros.instituicaoid = instituicaoid;
    }

    const skip = (page - 1) * limit;
    const cursos = await Curso.find(filtros)
      .populate('instituicaoid', 'nome')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Curso.countDocuments(filtros);

    res.json({
      cursos,
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
 * Busca um curso pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
const buscarCursoPorId = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id).populate('instituicaoid', 'nome');
    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
      });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Atualiza um curso pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
const atualizarCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instituicaoid', 'nome');

    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
      });
    }
    res.json(curso);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Dados inválidos',
        details: error.message
      });
    }
    res.status(500).json({
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
};

/**
 * Remove um curso pelo ID
 * @param {Object} req - Objeto de requisição
 * @param {Object} res - Objeto de resposta
 */
const removerCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({
        message: 'Curso não encontrado'
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
  criarCurso,
  listarCursos,
  buscarCursoPorId,
  atualizarCurso,
  removerCurso
};