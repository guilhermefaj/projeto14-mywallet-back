import { db } from "../database/database.connection.js"

export async function authValidation(req, res, next) {
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.status(401).send("Token não encontrado")

    try {
        const session = await db.collection("sessoes").findOne({ token })
        if (!session) return res.status(401).send("Token inválido")

        res.locals.session = session

        next()
    } catch {
        res.status(500).send(err.message)
    }
}