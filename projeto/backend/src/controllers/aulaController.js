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
 * Listar aulas com filtros - Módulo de Consultas de Horários (RF03)
 * @param {Object} req - Request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.laboratorio] - ID do laboratório para filtrar
 * @param {string} [req.query.professor] - ID do professor para filtrar
 * @param {string} [req.query.curso] - ID do curso para filtrar
 * @param {string} [req.query.dataInicio] - Data de início no formato YYYY-MM-DD
 * @param {string} [req.query.dataFim] - Data de fim no formato YYYY-MM-DD
 * @param {string} [req.query.disciplinaId] - ID da disciplina para filtrar
 * @param {string} [req.query.semestre] - Semestre para filtrar
 * @param {string} [req.query.diaSemana] - Dia da semana para filtrar
 * @param {number} [req.query.page=1] - Página para paginação
 * @param {number} [req.query.limit=20] - Limite de registros por página
 * @param {Object} res - Response object
 */
const listarAulas = async (req, res) => {
  try {
    const { 
      laboratorio, 
      professor, 
      curso, 
      dataInicio, 
      dataFim,
      cursoId, 
      professorId, 
      disciplinaId, 
      semestre, 
      diaSemana, 
      page = 1, 
      limit = 20 
    } = req.query;
    
    // Montagem dinâmica dos filtros
    const filtros = {};
    
    // Filtros por IDs (suporte aos nomes antigos e novos)
    if (curso || cursoId) filtros.cursoId = curso || cursoId;
    if (professor || professorId) filtros.professorId = professor || professorId;
    if (laboratorio) filtros.laboratorioId = laboratorio;
    if (disciplinaId) filtros.disciplinaId = disciplinaId;
    if (semestre) filtros.semestre = semestre;
    if (diaSemana) filtros.diaSemana = diaSemana;

    // Filtro por intervalo de datas
    if (dataInicio || dataFim) {
      filtros.$and = [];
      
      if (dataInicio && dataFim) {
        // Aulas que se sobrepõem ao período especificado
        filtros.$and.push({
          $or: [
            { dataInicio: { $lte: new Date(dataFim) }, dataFim: { $gte: new Date(dataInicio) } }
          ]
        });
      } else if (dataInicio) {
        // Aulas que terminam após a data de início
        filtros.$and.push({ dataFim: { $gte: new Date(dataInicio) } });
      } else if (dataFim) {
        // Aulas que começam antes da data de fim
        filtros.$and.push({ dataInicio: { $lte: new Date(dataFim) } });
      }
    }

    // Buscar aulas com populates obrigatórios
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