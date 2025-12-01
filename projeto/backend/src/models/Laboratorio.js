const mongoose = require('mongoose');

/**
 * @fileoverview Modelo Mongoose para a collection de laboratórios
 * @author Sistema de Gerenciamento de Laboratórios
 * @version 1.0.0
 */

/**
 * Schema do Laboratório
 * @typedef {Object} Laboratorio
 * @property {string} nome - Nome do laboratório
 * @property {string} codigo - Código único do laboratório
 * @property {string} [descricao] - Descrição do laboratório (opcional)
 * @property {number} capacidade - Capacidade máxima de pessoas
 * @property {string} localizacao - Localização do laboratório
 * @property {boolean} status - Status do laboratório (ativo/inativo)
 * @property {Date} createdAt - Data de criação do registro
 * @property {Date} updatedAt - Data da última atualização do registro
 */

/**
 * Schema Mongoose para Laboratório
 * Define a estrutura e validações para a collection de laboratórios
 */
const laboratorioSchema = new mongoose.Schema({
  /**
   * Nome do laboratório
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
   * Código único do laboratório
   * @type {string}
   * @required
   * @unique
   */
  codigo: {
    type: String,
    required: [true, 'Código é obrigatório'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Código deve ter no máximo 20 caracteres']
  },

  /**
   * Descrição do laboratório
   * @type {string}
   * @optional
   */
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },

  /**
   * Capacidade máxima de pessoas
   * @type {number}
   * @required
   */
  capacidade: {
    type: Number,
    required: [true, 'Capacidade é obrigatória'],
    min: [1, 'Capacidade deve ser no mínimo 1'],
    max: [200, 'Capacidade deve ser no máximo 200']
  },

  /**
   * Localização do laboratório
   * @type {string}
   * @required
   */
  localizacao: {
    type: String,
    required: [true, 'Localização é obrigatória'],
    trim: true,
    maxlength: [200, 'Localização deve ter no máximo 200 caracteres']
  },

  /**
   * Lista de equipamentos do laboratório
   * @type {Array<string>}
   * @optional
   */
  equipamentos: {
    type: [String],
    default: []
  },

  /**
   * Status do laboratório (ativo/inativo)
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
laboratorioSchema.index({ nome: 1 });
laboratorioSchema.index({ status: 1 });

/**
 * Modelo Laboratório
 * @type {mongoose.Model<Laboratorio>}
 */
const Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

module.exports = Laboratorio;