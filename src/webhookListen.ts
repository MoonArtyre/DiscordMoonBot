import express from "express"
import crypto from "crypto"
import { config } from "./config"
import child_process from "child_process"
import { StatusUpdate_DownloadFinished, InitializeBotUpdateStatus, StatusUpdate_InstallFinished } from "./StatusUpdateManager"
import { stderr } from "process"

const app = express()
const PORT = 3000

//The web parser
app.use(express.raw({ type: '*/*' }))

//Githup wehook handler
app.post("/GitPost", async (req, res) => {
    //Verify request
    const sig = req.headers["x-hub-signature-256"]

    if (sig == null || Array.isArray(sig)) {
        res.status(400).send("Incorrect signature")
        return
    }

    if (!await verifySignature(config.WEBHOOK_SECRET, sig, req.body)) {
        res.status(401).send("Unauthorized Signature")
        return
    }

    //Acknowledge request 
    res.status(200).end()

    //send message to status channel   
    InitializeBotUpdateStatus()

    //Start update process
    await child_process.execSync("git pull", { stdio: "ignore" })
    StatusUpdate_DownloadFinished()

    await child_process.execSync("npm i")
    StatusUpdate_InstallFinished()

    await child_process.execSync("npm run build")
})

//Generic response to opening the webpage
app.get("/", async (req, res) => {
    res.status(200)
    res.send("Holaaaa, this is a very cool message<br/><h1>Boop</h1>")
})

//Start listening to the port
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

//Verify Signature from Github Post
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