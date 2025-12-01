const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para a collection de professores
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Schema do Professor
 * @typedef {Object} Professor
 * @property {string} nome - Nome completo do professor
 * @property {string} email - E-mail institucional do professor (único)
 * @property {string} [telefone] - Telefone de contato do professor (opcional)
 * @property {boolean} status - Status do professor (ativo/inativo)
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização do registro
 */

/**
 * Schema Mongoose para Professor
 * Define a estrutura e validações para a collection de professores
 */
const professorSchema = new mongoose.Schema({
  /**
   * Nome completo do professor
   * @type {string}
   * @required
   */
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },

  /**
   * E-mail institucional do professor
   * @type {string}
   * @required
   * @unique
   */
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email deve ter um formato válido']
  },

  /**
   * Telefone de contato do professor
   * @type {string}
   * @optional
   */
  telefone: {
    type: String,
    trim: true,
    maxlength: [20, 'Telefone deve ter no máximo 20 caracteres']
  },

  /**
   * Status do professor (ativo/inativo)
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
   * - timestamps: adiciona automaticamente createdAt e updatedAt
   * - versionKey: desabilita o campo __v
   */
  timestamps: true,
  versionKey: false
});

/**
 * Índices para otimização de consultas
 */
professorSchema.index({ nome: 1 });
professorSchema.index({ status: 1 });

/**
 * Modelo Professor
 * @type {mongoose.Model<Professor>}
 */
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;