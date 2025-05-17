import express from "express"
import crypto from "crypto"
import { config } from "./config"

const app = express()
const PORT = 80
//teest
app.use(express.raw({ type: '*/*' }))
app.post("/GitPost", async (req, res) => {
    const sig = req.headers["x-hub-signature-256"]

    if (sig == null || Array.isArray(sig)) {
        res.status(400).send("Incorrect signature")
        return
    }

    if (!await verifySignature(config.WEBHOOK_SECRET, sig, req.body)) {
        res.status(401).send("Unauthorized Signature")
        return
    }

    res.status(200).end()
})

app.listen(PORT, () => console.log("Server running on ${PORT}"))

async function verifySignature(secret: string, signature: string, payload: string): Promise<boolean> {
    //Webhook sends "hashEncoder=hash" <= (honestly not sure lol), so we split this to use both parts for verification
    const splitSignature = signature.split("=")

    const postHMAC = splitSignature[0]
    const postSignature = splitSignature[1]

    const signatureCheck = crypto.createHmac(postHMAC, secret).update(payload).digest("hex")

    return signatureCheck === postSignature;
}