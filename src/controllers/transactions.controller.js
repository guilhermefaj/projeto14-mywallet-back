import { db } from "../database/database.connection.js"
import dayjs from "dayjs"
import { cashFlowSchema } from "../schemas/transactions.schemas.js"

export async function postNovaTransacao(req, res) {
    const { tipo } = req.params
    let { transactionName, value } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    const validation = cashFlowSchema.validate(req.body, { abortEarly: false })
    if (validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    if (!token) return res.status(401).send("Token não encontrado")

    try {
        const session = await db.collection("sessoes").findOne({ token })
        if (!session) return res.status(401).send("Token inválido")

        const date = dayjs().format("DD/MM")

        await db.collection("transacoes").insertOne({ ...req.body, type: tipo, userId: session.userId, date: date })
        res.status(201).send(`O valor ${value} foi inserido no fluxo de caixa`)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getTransacoes(req, res) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Token não encontrado")

    try {
        const session = await db.collection("sessoes").findOne({ token })
        if (!session) return res.status(401).send("Token inválido")

        const transactions = await db.collection("transacoes").find({ userId: session.userId }).toArray()

        res.status(200).send(transactions)
    } catch (err) {
        res.status(500).send(err.message)
    }
}