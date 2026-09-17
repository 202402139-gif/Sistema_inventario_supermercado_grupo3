import express from "express"
import { PORT } from "./config.js"
import supermercadoRoutes from "./routes/supermercado.route.js"
import morgan from "morgan"
import cors from "cors"

const app = express()

app.set('etag', false)

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
})

app.use('/api', supermercadoRoutes)

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT)
})