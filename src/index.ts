import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import router from "./routes/api"
import scheduler from "../scheduler"

const app = express()
app.use(express.json())

const PORT = 3000

app.use("/api/v1", router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)

  scheduler.jobRestockProduct()
})