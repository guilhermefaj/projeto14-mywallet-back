import { Router } from "express"
import { getTransacoes, postNovaTransacao } from "../controllers/transactions.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { cashFlowSchema } from "../schemas/transactions.schemas.js"
import { authValidation } from "../middlewares/auth.middleware.js"

const transactionsRouter = Router()

transactionsRouter.use(authValidation)

transactionsRouter.post("/nova-transacao/:tipo", validateSchema(cashFlowSchema), postNovaTransacao)
transactionsRouter.get("/home", getTransacoes)

export default transactionsRouter