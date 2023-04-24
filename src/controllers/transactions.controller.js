import { db } from "../database/database.connection.js"
import dayjs from "dayjs"

export async function postNovaTransacao(req, res) {
    const { tipo } = req.params
    let { transactionName, value } = req.body

    try {
        const date = dayjs().format("DD/MM")

        const session = res.locals.session
        await db.collection("transacoes").insertOne({ ...req.body, type: tipo, userId: session.userId, date: date })
        res.status(201).send(`O valor ${value} foi inserido no fluxo de caixa`)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getTransacoes(req, res) {

    try {
        const session = res.locals.session
        const transactions = await db.collection("transacoes").find({ userId: session.userId }).toArray()

        res.status(200).send(transactions)
    } catch (err) {
        res.status(500).send(err.message)
    }
}