import express from "express"
import crypto from "crypto"
import { config } from "./config"
import child_process from "child_process"
import { client, StatusChannel } from "."
import { TextChannel } from "discord.js"

const app = express()
const PORT = 3000

//The web parser
app.use(express.raw({ type: '*/*' }))

//#region Github webhook listener
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

    //send message to status channel
    const statusTextChannel = await client.channels.fetch(StatusChannel) as TextChannel
    const statusMessage = await statusTextChannel.send(`Updating Bot...\nStatus: Downloading...`)

    const startTime = Date.now()

    await child_process.execSync("git pull")
    const updateProcessTime = Date.now() - startTime
    statusMessage.edit(`Updating Bot...\nStatus: Installing...\nDownload: Completed in ${updateProcessTime}`)

    await child_process.execSync("npm i")
    const installProcessTime = Date.now() - startTime
    statusMessage.edit(`Updating Bot...\nStatus: restarting...\nDownload: Completed in ${updateProcessTime}\nInstall: Completed in ${installProcessTime}`)

    await child_process.execSync("npm run build")
})
//#endregion

app.get("/", async (req, res) => {
    res.status(200)
    res.send("Holaaaa, this is a very cool message<br/><h1>Boop</h1>")
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))


async function verifySignature(secret: string, signature: string, payload: Buffer): Promise<boolean> {
    const expectedHMAC = "sha256"
    const splitSignature = signature.split("=")

    const postHMAC = splitSignature[0]
    const postSignature = splitSignature[1]

    const signatureCheck = crypto.createHmac(postHMAC, secret).update(payload).digest("hex")

    if (!crypto.timingSafeEqual(Buffer.from(expectedHMAC), Buffer.from(postHMAC)) || !crypto.timingSafeEqual(Buffer.from(postSignature), Buffer.from(signatureCheck))) {
        return false
    }

    return true
}