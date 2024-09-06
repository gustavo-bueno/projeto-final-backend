const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use("/users", require("./routes/user"))
app.use("/install", require("./routes/install"))


app.listen(3000, () => {
  console.log("Listening to port: 3000")
})
