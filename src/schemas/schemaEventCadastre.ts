import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";
import { AccessibilityLevel } from "../interfaces/eventInterface.js";

export const schemaEvent = Joi.object({
    title: Joi.string().required().custom(
        (value) => removeWhitespace(value)
    ).min(3).max(120).messages({
        'string.base': 'Título deve ser uma string',
        'string.empty': 'Título não pode estar vazio',
        'string.min': 'Título deve conter no mínimo 3 caracteres',
        'string.max': 'Título deve conter no máximo 120 caracteres'
    }),
    description: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).min(3).max(120).messages({
        'string.base': 'Descrição deve ser uma string',
    }),
    linkEvent: Joi.string().uri().optional().messages({
        'string.base': 'O link deve ser uma string',
        'string.uri': 'O link deve ser uma URL válida',
    }),
    price: Joi.number().precision(2).positive().max(999999.99).required().messages({
        'number.base': 'Preço deve ser um número válido',
        'number.positive': 'Preço deve ser maior que zero',
        'number.max': 'Preço não pode ultrapassar R$ 999.999,99',
        'number.precision': 'Preço deve ter no máximo 2 casas decimais',
        'any.required': 'Preço é obrigatório'
    }),
    address: Joi.object({
        street: Joi.string().required().custom(
            (value) => removeWhitespace(value)
        ).min(10).max(120).messages({
            'string.base': 'Rua deve ser uma string',
            'string.empty': 'Rua não pode estar vazia',
            'string.min': 'Rua deve conter no mínimo 10 caracteres',
            'string.max': 'Rua deve conter no máximo 120 caracteres'
        }),
        number: Joi.string().custom(
            (value) => removeWhitespace(value)
        ).max(8).pattern(new RegExp('^[a-zA-Z0-9\\s]+$')).required().messages({
            'string.base': 'Número deve ser uma string',
            'string.empty': 'Número não pode estar vazio',
            'string.pattern.base': 'Número aceita apenas caracteres alfanuméricos',
            'string.max': 'Número deve conter no máximo 8 caracteres'
        }),
        neighborhood: Joi.string().required().custom(
            (value) => removeWhitespace(value)
        ).min(5).max(20).messages({
            'string.base': 'Bairro deve ser uma string',
            'string.empty': 'Bairro não pode estar vazio',
            'string.min': 'Bairro deve conter no mínimo 5 caracteres',
            'string.max': 'Bairro deve conter no máximo 20 caracteres'
        }),
        complement: Joi.string().trim().optional().max(30).messages({
            'string.base': 'Complemento deve ser uma string',
            'string.max': 'Complemento deve conter no máximo 30 caracteres'
        }),
    }).required(),
    startDateTime: Joi.date().min('now').required().messages({
        'date.base': 'Data de início deve ser válida',
        'date.min': 'Data de início não pode ser anterior à data atual',
        'any.required': 'Data de início é obrigatória'
    }),
    endDateTime: Joi.date().greater(Joi.ref('startDateTime')).optional().messages({
        'date.base': 'Data de término deve ser válida',
        'date.greater': 'Data de término não pode ser menor que a data de início',
    }),
    accessibilityLevel: Joi.string().valid(...Object.values(AccessibilityLevel)).optional().messages({
        'any.only': 'Nível de acessibilidade inválido'
    })

});
