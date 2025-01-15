import Joi from "joi";
import { removeWhitespace } from "../utils/formatters/removeWhitespace.js";

export const schemaEventCategoryUpdate = Joi.object({
    categoryName: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).max(30).messages({
        'string.base': 'Nome da categoria deve ser uma string',
        'string.max': 'Nome da categoria deve conter no máximo 30 caracteres'
    }),
    categoryDescription: Joi.string().optional().custom(
        (value) => removeWhitespace(value)
    ).max(300).messages({
        'string.base': 'Nome da categoria deve ser uma string',
        'string.max': 'Nome da categoria deve conter no máximo 300 caracteres'
    })
})
