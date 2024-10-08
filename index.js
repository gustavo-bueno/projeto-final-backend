const express = require("express")
const path = require("path")
require("dotenv").config()
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_doc.json');

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use("/users", require("./routes/user"))
app.use("/categories", require("./routes/category"))
app.use("/goals", require("./routes/goal"))
app.use("/transactions", require("./routes/transaction"))
app.use("/install", require("./routes/install"))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))


app.listen(3000, () => {
  console.log("Listening to port: 3000")
})
