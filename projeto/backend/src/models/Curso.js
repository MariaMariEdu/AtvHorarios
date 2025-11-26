const mongoose = require('mongoose');

/**
 * Schema para o modelo de Cursos
 * @typedef {Object} Curso
 * @property {mongoose.Types.ObjectId} instituicaoid - Referência ao ID de uma instituição
 * @property {string} nome - Nome do curso
 * @property {string} turno - Turno em que o curso é oferecido
 * @property {boolean} status - Status do curso (ativo/inativo)
 * @property {Date} createdAt - Data de criação
 * @property {Date} updatedAt - Data de atualização
 */

/**
 * Schema do Mongoose para Cursos
 */
const cursoSchema = new mongoose.Schema({
  instituicaoid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituicao',
    required: [true, 'ID da instituição é obrigatório']
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  turno: {
    type: String,
    required: [true, 'Turno é obrigatório'],
    enum: ['Matutino', 'Vespertino', 'Noturno', 'Integral'],
    trim: true
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'cursos'
});

/**
 * Modelo Mongoose para Cursos
 * @class Curso
 */
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;