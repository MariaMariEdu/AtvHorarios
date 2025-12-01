const mongoose = require('mongoose');

/**
 * Schema para o modelo de Aulas
 * 
 * @typedef {Object} Aula
 * @property {string} semestre - Semestre letivo da aula (ex: '2025/1')
 * @property {mongoose.Types.ObjectId} cursoId - Referência para o curso
 * @property {mongoose.Types.ObjectId} disciplinaId - Referência para a disciplina
 * @property {mongoose.Types.ObjectId} professorId - Referência para o professor
 * @property {mongoose.Types.ObjectId} laboratorioId - Referência para o laboratório
 * @property {string} diaSemana - Dia da semana da aula (Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo)
 * @property {mongoose.Types.ObjectId[]} blocos - Lista de blocos de horário utilizados pela aula
 * @property {Date} dataInicio - Data inicial de vigência da aula
 * @property {Date} dataFim - Data final de vigência da aula
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização do registro
 */

const aulaSchema = new mongoose.Schema({
  /**
   * Semestre letivo da aula
   * @type {String}
   * @required
   * @example '2025/1'
   */
  semestre: {
    type: String,
    required: [true, 'Semestre é obrigatório'],
    trim: true
  },

  /**
   * Referência para o curso
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref 'Curso'
   */
  cursoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: [true, 'Curso é obrigatório']
  },

  /**
   * Referência para a disciplina
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref 'Disciplina'
   */
  disciplinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disciplina',
    required: [true, 'Disciplina é obrigatória']
  },

  /**
   * Referência para o professor
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref 'Professor'
   */
  professorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: [true, 'Professor é obrigatório']
  },

  /**
   * Referência para o laboratório
   * @type {mongoose.Types.ObjectId}
   * @required
   * @ref 'Laboratorio'
   */
  laboratorioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratorio',
    required: [true, 'Laboratório é obrigatório']
  },

  /**
   * Dia da semana da aula
   * @type {String}
   * @required
   * @enum ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
   */
  diaSemana: {
    type: String,
    required: [true, 'Dia da semana é obrigatório'],
    enum: {
      values: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
      message: 'Dia da semana deve ser: Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira, Sábado ou Domingo'
    }
  },

  /**
   * Lista de blocos de horário utilizados pela aula
   * @type {mongoose.Types.ObjectId[]}
   * @required
   * @ref 'BlocoHorario'
   */
  blocos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlocoHorario',
    required: true
  }],

  /**
   * Data inicial de vigência da aula
   * @type {Date}
   * @required
   */
  dataInicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },

  /**
   * Data final de vigência da aula
   * @type {Date}
   * @required
   */
  dataFim: {
    type: Date,
    required: [true, 'Data de fim é obrigatória']
  }
}, {
  timestamps: true,
  collection: 'aulas'
});

/**
 * Modelo Mongoose para Aulas
 * @type {mongoose.Model<Aula>}
 */
const Aula = mongoose.model('Aula', aulaSchema);

module.exports = Aula;