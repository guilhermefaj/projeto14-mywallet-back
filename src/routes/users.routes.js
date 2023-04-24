import { Router } from "express"
import { postCadastro, postLogin } from "../controllers/users.controller.js"

const usersRouter = Router()

usersRouter.post("/cadastro", postCadastro)
usersRouter.post("/login", postLogin)

export default usersRouter