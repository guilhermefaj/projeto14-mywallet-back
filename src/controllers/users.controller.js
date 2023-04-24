import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js"

export async function postCadastro(req, res) {
    const { name, email, password } = req.body

    const validation = signUpSchema.validate(req.body, { abortEarly: false })
    if (validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        const user = await db.collection("cadastro").findOne({ email })
        if (user) return res.status(409).send("O e-mail já foi cadastrado")

        const hash = bcrypt.hashSync(password, 10)

        await db.collection("cadastro").insertOne({ name, email, password: hash })
        res.status(201).send("Conta criada com sucesso")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function postLogin(req, res) {
    const { email, password } = req.body

    const validation = signInSchema.validate(req.body, { abortEarly: false })
    if (validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        const user = await db.collection("cadastro").findOne({ email })
        if (!user) return res.status(404).send("O e-mail não está cadastrado")

        const passwordCorrect = bcrypt.compareSync(password, user.password)
        if (!passwordCorrect) return res.status(401).send("Senha incorreta")

        const token = uuid()
        await db.collection("sessoes").insertOne({ token, userId: user._id })
        res.send({ name: user.name, userId: user._id, email: user.email, token })
    } catch (err) {
        res.status(500).send(err.message)
    }
}