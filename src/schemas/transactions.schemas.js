import joi from "joi"

export const cashFlowSchema = joi.object({
    transactionName: joi.string().min(1).required(),
    value: joi.number().greater(0).precision(2).required()
})