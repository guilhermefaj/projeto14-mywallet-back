import { Router } from "express"
import { postCadastro, postLogin } from "../controllers/users.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js"

const usersRouter = Router()

usersRouter.post("/cadastro", validateSchema(signUpSchema), postCadastro)
usersRouter.post("/login", validateSchema(signInSchema), postLogin)

export default usersRouter