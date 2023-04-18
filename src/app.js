import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import joi from "joi"
import { MongoClient } from "mongodb"

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

// Endpoints
app.post("/cadastro", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    const validation = signUpSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const user = await db.collection("cadastro").findOne({ email })
        if (user) return res.status(409).send("O e-mail já foi cadastrado.")

        await db.collection("cadastro").insertOne(req.body)
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

        if (!user) {
            return res.status(404).send("O email não está cadastrado")
        }

        if (user.password !== password) {
            return res.status(401).send("Senha inválida")
        }

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))