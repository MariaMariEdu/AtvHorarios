const Aula = require('../models/Aula');

/**
 * Verifica conflitos de horário para laboratório e professor
 * @param {Object} aulaData - Dados da aula
 * @param {string} aulaId - ID da aula (para exclusão na atualização)
 * @returns {Object|null} - Retorna conflito encontrado ou null
 */
const verificarConflitos = async (aulaData, aulaId = null) => {
  const { professorId, laboratorioId, diaSemana, blocos, dataInicio, dataFim } = aulaData;
  
  const query = {
    diaSemana,
    blocos: { $in: blocos },
    $or: [
      { dataInicio: { $lte: new Date(dataFim) }, dataFim: { $gte: new Date(dataInicio) } }
    ]
  };
  
  if (aulaId) {
    query._id = { $ne: aulaId };
  }

  // Verificar conflito de professor
  const conflitoProfessor = await Aula.findOne({ ...query, professorId })
    .populate('disciplinaId', 'nome')
    .populate('laboratorioId', 'nome');
  if (conflitoProfessor) {
    return {
      tipo: 'professor',
      message: `Professor já possui aula no mesmo horário`,
      aula: conflitoProfessor
    };
  }

  // Verificar conflito de laboratório
  const conflitoLaboratorio = await Aula.findOne({ ...query, laboratorioId })
    .populate('disciplinaId', 'nome')
    .populate('professorId', 'nome');
  if (conflitoLaboratorio) {
    return {
      tipo: 'laboratorio',
      message: `Laboratório já está ocupado no mesmo horário`,
      aula: conflitoLaboratorio
    };
  }

  return null;
};

/**
 * Criar nova aula
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const criarAula = async (req, res) => {
  try {
    const conflito = await verificarConflitos(req.body);
    
    if (conflito) {
      return res.status(409).json({
        message: conflito.message,
        tipo: conflito.tipo,
        aulaConflitante: conflito.aula
      });
    }

    const aula = new Aula(req.body);
    await aula.save();
    
    // Retornar aula com dados populados
    const aulaPopulada = await Aula.findById(aula._id)
      .populate('cursoId', 'nome')
      .populate('disciplinaId', 'nome codigo')
      .populate('professorId', 'nome')
      .populate('laboratorioId', 'nome codigo')
      .populate('blocos', 'nome horarioInicial horarioFinal');
    
    res.status(201).json(aulaPopulada);
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao criar aula',
      details: error.message
    });
  }
};

/**
 * Listar aulas com filtros
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const listarAulas = async (req, res) => {
  try {
    const { cursoId, professorId, disciplinaId, semestre, diaSemana, page = 1, limit = 20 } = req.query;
    
    const filtros = {};
    if (cursoId) filtros.cursoId = cursoId;
    if (professorId) filtros.professorId = professorId;
    if (disciplinaId) filtros.disciplinaId = disciplinaId;
    if (semestre) filtros.semestre = semestre;
    if (diaSemana) filtros.diaSemana = diaSemana;

    const aulas = await Aula.find(filtros)
      .populate('cursoId', 'nome')
      .populate('disciplinaId', 'nome codigo')
      .populate('professorId', 'nome')
      .populate('laboratorioId', 'nome codigo')
      .populate('blocos', 'nome horarioInicial horarioFinal')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json(aulas);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao listar aulas',
      details: error.message
    });
  }
};

/**
 * Buscar aula por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const buscarAulaPorId = async (req, res) => {
  try {
    const aula = await Aula.findById(req.params.id)
      .populate('cursoId', 'nome')
      .populate('disciplinaId', 'nome codigo')
      .populate('professorId', 'nome')
      .populate('laboratorioId', 'nome codigo')
      .populate('blocos', 'nome horarioInicial horarioFinal');

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada'
      });
    }

    res.json(aula);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar aula',
      details: error.message
    });
  }
};

/**
 * Atualizar aula
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const atualizarAula = async (req, res) => {
  try {
    const conflito = await verificarConflitos(req.body, req.params.id);
    
    if (conflito) {
      return res.status(409).json({
        message: conflito.message,
        tipo: conflito.tipo,
        aulaConflitante: conflito.aula
      });
    }

    const aula = await Aula.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('cursoId', 'nome')
     .populate('disciplinaId', 'nome codigo')
     .populate('professorId', 'nome')
     .populate('laboratorioId', 'nome codigo')
     .populate('blocos', 'nome horarioInicial horarioFinal');

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada'
      });
    }

    res.json(aula);
  } catch (error) {
    res.status(400).json({
      message: 'Erro ao atualizar aula',
      details: error.message
    });
  }
};

/**
 * Remover aula
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const removerAula = async (req, res) => {
  try {
    const aula = await Aula.findByIdAndDelete(req.params.id);

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao remover aula',
      details: error.message
    });
  }
};

module.exports = {
  criarAula,
  listarAulas,
  buscarAulaPorId,
  atualizarAula,
  removerAula
};