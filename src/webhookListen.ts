import express from "express"
import bodyParser from "body-parser"

const app = express()
const PORT = 80
//teest
app.use(bodyParser.json())
app.post("", (req, res) => {
    console.log(req.body)
    res.status(200).end()
})

app.listen(PORT, () => console.log("Server running on ${PORT}"))
