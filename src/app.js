import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import joi from "joi"
import { MongoClient } from "mongodb"
import router from "./routes/index.routes.js"
const app = express()

// Configs
app.use(cors())
app.use(express.json())
app.use(router)
dotenv.config()

// Conexão DB
const mongoClient = new MongoClient(process.env.MONGO_URI)
try {
    await mongoClient.connect()
    console.log("MongoDB conectado!")
} catch (err) {
    console.log(err.message)
}

export const db = mongoClient.db()

// Schemas
export const signInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).alphanum().required()
})

export const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).alphanum().required(),
})

export const cashFlowSchema = joi.object({
    transactionName: joi.string().min(1).required(),
    value: joi.number().greater(0).precision(2).required()
})


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))