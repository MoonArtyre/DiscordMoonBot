import express from "express"
import bodyParser from "body-parser"
import { Webhooks } from "@octokit/webhooks"
import { config } from "./config"

const webhooks = new Webhooks({
    secret: config.WEBHOOK_SECRET,
})

const app = express()
const PORT = 80
//teest
app.use(bodyParser.json())
app.post("", (req, res) => {
    console.log(req)

    const signature = req.headers["x-hub-signature-256"]

    if (signature == null || Array.isArray(signature)) {
        res.status(400).send("Signature error")
        return
    }

    if (!webhooks.verify(req.body, signature)) {
        res.status(401).send("Unauthorized")
        return
    }

    res.status(200).end()
})

app.listen(PORT, () => console.log("Server running on ${PORT}"))

