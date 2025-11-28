const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para a collection disciplinas
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Schema para disciplinas do sistema
 * @typedef {Object} DisciplinaSchema
 * @property {mongoose.Schema.Types.ObjectId} curso - ID do curso ao qual a disciplina pertence
 * @property {string} nome - Nome da disciplina
 * @property {number} cargaHoraria - Carga horária total da disciplina
 * @property {mongoose.Schema.Types.ObjectId} professorResponsavel - ID do professor responsável (opcional)
 * @property {boolean} status - Status da disciplina (ativa/inativa)
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização do registro
 */

const disciplinaSchema = new mongoose.Schema({
  /**
   * ID do curso ao qual a disciplina pertence
   * @type {mongoose.Schema.Types.ObjectId}
   * @optional
   * @ref Curso
   */
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    default: null
  },

  /**
   * Nome da disciplina
   * @type {string}
   * @required
   * @minlength 2
   * @maxlength 100
   */
  nome: {
    type: String,
    required: [true, 'O nome da disciplina é obrigatório'],
    trim: true,
    minlength: [2, 'O nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'O nome deve ter no máximo 100 caracteres']
  },

  /**
   * Código da disciplina
   * @type {string}
   * @required
   * @unique
   */
  codigo: {
    type: String,
    required: [true, 'O código da disciplina é obrigatório'],
    trim: true,
    unique: true,
    uppercase: true
  },

  /**
   * Carga horária total da disciplina
   * @type {number}
   * @required
   * @min 1
   * @max 1000
   */
  cargaHoraria: {
    type: Number,
    required: [true, 'A carga horária é obrigatória'],
    min: [1, 'A carga horária deve ser maior que 0'],
    max: [1000, 'A carga horária deve ser menor que 1000 horas']
  },

  /**
   * ID do professor responsável pela disciplina
   * @type {mongoose.Schema.Types.ObjectId}
   * @optional
   * @ref Professor
   */
  professorResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    default: null
  },

  /**
   * Status da disciplina (ativa/inativa)
   * @type {boolean}
   * @default true
   */
  status: {
    type: Boolean,
    default: true
  }
}, {
  /**
   * Configurações do schema
   * @property {boolean} timestamps - Adiciona createdAt e updatedAt automaticamente
   * @property {string} collection - Nome da collection no MongoDB
   */
  timestamps: true,
  collection: 'disciplinas'
});

/**
 * Índices para otimização de consultas
 */
disciplinaSchema.index({ curso: 1 });
disciplinaSchema.index({ nome: 1 });
disciplinaSchema.index({ codigo: 1 });
disciplinaSchema.index({ professorResponsavel: 1 });
disciplinaSchema.index({ status: 1 });

/**
 * Método virtual para obter disciplinas ativas
 * @returns {Query} Query para disciplinas com status ativo
 */
disciplinaSchema.statics.findAtivas = function() {
  return this.find({ status: true });
};

/**
 * Método virtual para obter disciplinas por curso
 * @param {string} cursoId - ID do curso
 * @returns {Query} Query para disciplinas do curso especificado
 */
disciplinaSchema.statics.findByCurso = function(cursoId) {
  return this.find({ curso: cursoId });
};

/**
 * Middleware pre-save para validações adicionais
 */
disciplinaSchema.pre('save', function(next) {
  // Capitalizar primeira letra do nome
  if (this.nome) {
    this.nome = this.nome.charAt(0).toUpperCase() + this.nome.slice(1);
  }
  next();
});

/**
 * Modelo Mongoose para disciplinas
 * @class Disciplina
 * @extends mongoose.Model
 */
const Disciplina = mongoose.model('Disciplina', disciplinaSchema);

module.exports = Disciplina;