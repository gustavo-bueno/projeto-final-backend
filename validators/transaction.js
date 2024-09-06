const Joi = require('joi');

const transactionSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'O nome deve ser uma string',
    'string.empty': 'O nome é obrigatório',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
    'any.required': 'O nome é obrigatório'
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'string.base': 'O tipo deve ser uma string',
    'string.empty': 'O tipo é obrigatório',
    'any.only': 'O tipo deve ser "income" ou "expense"',
    'any.required': 'O tipo é obrigatório'
  }),
  date: Joi.date().required().messages({
    'date.base': 'A data deve ser uma data válida',
    'any.required': 'A data é obrigatória'
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': 'O ID da categoria deve ser um número',
    'number.integer': 'O ID da categoria deve ser um número inteiro',
    'number.positive': 'O ID da categoria deve ser um número positivo',
    'any.required': 'O ID da categoria é obrigatório'
  })
});

const updateTransactionSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.base': 'O nome deve ser uma string',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  type: Joi.string().valid('income', 'expense').optional().messages({
    'string.base': 'O tipo deve ser uma string',
    'any.only': 'O tipo deve ser "income" ou "expense"',
  }),
  date: Joi.string().optional().messages({
    'date.base': 'A data deve ser uma data válida',
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    'number.base': 'O ID da categoria deve ser um número',
    'number.integer': 'O ID da categoria deve ser um número inteiro',
    'number.positive': 'O ID da categoria deve ser um número positivo',
  })
});

module.exports = { transactionSchema, updateTransactionSchema };
