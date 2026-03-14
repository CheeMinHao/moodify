const express = require("express");
const apiRoutes = require("./routes/api.routes")
import { env } from "./config/env";

const app = express()

app.use(express.json())

app.use("/api", apiRoutes)

app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok" })
})

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`)
})