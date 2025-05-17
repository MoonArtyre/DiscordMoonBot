import express from "express"
import bodyParser from "body-parser"
import { config } from "./config"

const app = express()
const PORT = 80
//teest
app.use(bodyParser.json())
app.post("", async (req, res) => {
    const sig = req.headers["x-hub-signature-256"]

    if (sig == null || Array.isArray(sig)) {
        res.status(400).send("Incorrect signature")
        return
    }

    console.log(req)

    if (!await verifySignature(config.WEBHOOK_SECRET, sig, req.body))

        res.status(200).end()
})

app.listen(PORT, () => console.log("Server running on ${PORT}"))

const encoder = new TextEncoder();

async function verifySignature(secret: string, signature: string, payload: string): Promise<boolean> {

    const algorithm = { name: "HMAC", hash: { name: 'SHA-256' } };

    const keyBytes = encoder.encode(secret);
    const extractable = false;
    const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        extractable,
        ["sign", "verify"],
    );

    const sigBytes = hexToBytes(signature);
    const dataBytes = encoder.encode(payload);
    const equal = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    );

    return equal;
}

function hexToBytes(hex: string) {
    const len = hex.length / 2;
    const bytes = new Uint8Array(len);

    let index = 0;
    for (let i = 0; i < hex.length; i += 2) {
        const c = hex.slice(i, i + 2);
        const b = parseInt(c, 16);
        bytes[index] = b;
        index += 1;
    }

    return bytes;
}