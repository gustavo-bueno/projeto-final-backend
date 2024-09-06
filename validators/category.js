const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'O nome deve ser uma string',
    'string.empty': 'O nome não pode estar vazio',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
    'any.required': 'O nome é obrigatório'
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  type: Joi.string().valid('Transaction', 'Goal').required().messages({
    'string.base': 'O tipo deve ser uma string',
    'string.empty': 'O tipo não pode estar vazio',
    'any.only': 'O tipo deve ser "Transaction" ou "Goal"',
    'any.required': 'O tipo é obrigatório'
  })
});

const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.base': 'O nome deve ser uma string',
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
  }),
  description: Joi.string().max(255).optional().messages({
    'string.base': 'A descrição deve ser uma string',
    'string.max': 'A descrição deve ter no máximo 255 caracteres'
  }),
  type: Joi.string().valid('Transaction', 'Goal').optional().messages({
    'string.base': 'O tipo deve ser uma string',
    'any.only': 'O tipo deve ser "Transaction" ou "Goal"',
  })
});

module.exports = { categorySchema, updateCategorySchema };
