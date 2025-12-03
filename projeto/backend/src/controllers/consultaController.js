const Aula = require('../models/Aula');

/**
 * Calcular início e fim da semana (Segunda a Sábado) a partir de uma data
 * @param {string} dataBase - Data no formato YYYY-MM-DD
 * @returns {Object} - { inicioSemana, fimSemana }
 */
const calcularSemana = (dataBase) => {
  const data = new Date(dataBase);
  const diaSemana = data.getDay(); // 0=Domingo, 1=Segunda, ..., 6=Sábado
  
  // Calcular segunda-feira da semana
  const diasParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
  const inicioSemana = new Date(data);
  inicioSemana.setDate(data.getDate() + diasParaSegunda);
  
  // Calcular sábado da semana
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 5);
  
  return { inicioSemana, fimSemana };
};

/**
 * Consultar horários com filtros dinâmicos
 * @param {Object} req - Request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.laboratorio] - ID do laboratório
 * @param {string} [req.query.professor] - ID do professor
 * @param {string} [req.query.curso] - ID do curso
 * @param {string} [req.query.disciplina] - ID da disciplina
 * @param {string} [req.query.dataInicio] - Data início (YYYY-MM-DD)
 * @param {string} [req.query.dataFim] - Data fim (YYYY-MM-DD)
 * @param {string} [req.query.semana] - Data base para calcular semana (YYYY-MM-DD)
 * @param {Object} res - Response object
 */
const consultarHorarios = async (req, res) => {
  try {
    const { laboratorio, professor, curso, disciplina, dataInicio, dataFim, semana } = req.query;
    
    // Montar filtro dinâmico
    const filtro = {};
    
    if (laboratorio) filtro.laboratorioId = laboratorio;
    if (professor) filtro.professorId = professor;
    if (curso) filtro.cursoId = curso;
    if (disciplina) filtro.disciplinaId = disciplina;
    
    // Filtro por intervalo de datas ou semana específica
    if (semana) {
      const { inicioSemana, fimSemana } = calcularSemana(semana);
      filtro.$and = [{
        $or: [
          { dataInicio: { $lte: fimSemana }, dataFim: { $gte: inicioSemana } }
        ]
      }];
    } else if (dataInicio || dataFim) {
      filtro.$and = [];
      
      if (dataInicio && dataFim) {
        filtro.$and.push({
          $or: [
            { dataInicio: { $lte: new Date(dataFim) }, dataFim: { $gte: new Date(dataInicio) } }
          ]
        });
      } else if (dataInicio) {
        filtro.$and.push({ dataFim: { $gte: new Date(dataInicio) } });
      } else if (dataFim) {
        filtro.$and.push({ dataInicio: { $lte: new Date(dataFim) } });
      }
    }
    
    // Buscar aulas com dados populados
    const aulas = await Aula.find(filtro)
      .populate('cursoId', 'nome')
      .populate('disciplinaId', 'nome codigo')
      .populate('professorId', 'nome')
      .populate('laboratorioId', 'nome codigo')
      .populate('blocos', 'nome horarioInicial horarioFinal')
      .sort({ diaSemana: 1, createdAt: 1 });
    
    res.json({
      total: aulas.length,
      filtros: req.query,
      aulas
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao consultar horários',
      details: error.message
    });
  }
};

module.exports = {
  consultarHorarios
};