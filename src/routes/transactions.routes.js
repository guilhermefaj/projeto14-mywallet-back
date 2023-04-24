import { Router } from "express"
import { getTransacoes, postNovaTransacao } from "../controllers/transactions.controller.js"

const transactionsRouter = Router()

transactionsRouter.post("/nova-transacao/:tipo", postNovaTransacao)
transactionsRouter.get("/home", getTransacoes)

export default transactionsRouter