import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import joi from "joi"
import { MongoClient, ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

const app = express()

// Configs
app.use(cors())
app.use(express.json())
dotenv.config()

// Conexão DB
const mongoClient = new MongoClient(process.env.DATABASE_URL)
try {
    await mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}

const db = mongoClient.db()

// Schemas
const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).alphanum().required()
})

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).alphanum().required(),
    confirmPassword: joi.string().min(3).alphanum().required().valid(joi.ref('password'))
})

const cashFlowSchema = joi.object({
    value: joi.number().greater(0).precision(2).required()
})

// Endpoints
app.post("/cadastro", async (req, res) => {
    const { name, email, password } = req.body

    const validation = signUpSchema.validate(req.body, { abortEarly: false })
    if (validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        const user = await db.collection("cadastro").findOne({ email })
        if (user) return res.status(409).send("O e-mail já foi cadastrado.")

        const hash = bcrypt.hashSync(password, 10)

        await db.collection("cadastro").insertOne({ name, email, password: hash })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/login", async (req, res) => {
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
        res.send(token)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/nova-transacao/:tipo", async (req, res) => {
    const { tipo } = req.params
    let { value } = req.body

    const validation = cashFlowSchema.validate(req.body, { abortEarly: false })
    if (validation.error) return res.status(422).send(validation.error.details.map(detail => detail.message))

    try {
        await db.collection("transacoes").insertOne({ value })
        res.status(201).send(`O valor ${value} foi inserido no fluxo de caixa.`)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/home", async (req, res) => {
    try {
        const operacoes = await db.collection("transacoes").find().toArray()
        res.status(200).send(operacoes)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))