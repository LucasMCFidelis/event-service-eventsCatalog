import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";

export const schemaEventCategory = Joi.object({
    categoryName: Joi.string().required().custom(
        (value) => removeWhitespace(value)
    ).min(3).max(30).messages({
        'string.base': 'Nome da categoria deve ser uma string',
        'string.empty': 'Nome da categoria não pode estar vazio',
        'string.min': 'Nome da categoria deve conter no mínimo 3 caracteres',
        'string.max': 'Nome da categoria deve conter no máximo 30 caracteres'
    }),
    categoryDescription: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).max(300).messages({
        'string.base': 'Nome da categoria deve ser uma string',
        'string.max': 'Nome da categoria deve conter no máximo 300 caracteres'
    })
})
