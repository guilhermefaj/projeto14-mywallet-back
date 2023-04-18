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
const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).alphanum().required()
})

// Endpoints
app.post("/users", async (req, res) => {
    const { email, password } = req.body

    const validation = userSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        return res.status(422).send(validation.error.details.map(detail => detail.message))
    }

    try {
        const user = await db.collection("users").findOne({ email })
        if (user) return res.status(409).send("O e-mail já foi cadastrado.")

        await db.collection("users").insertOne(req.body)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))