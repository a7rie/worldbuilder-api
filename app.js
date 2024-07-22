const express = require("express")
const cors = require("cors")

const userRouter = require("./routes/users")
const worldRouter = require("./routes/worlds")
const loginRouter = require("./routes/login")
const database = require("./models/index")

const tokenValidator = require("./middleware/tokenValidator")

const sequelize = database.sequelize

sequelize.authenticate().then(() => {
  console.log("connected to database")
}).catch((err) => {
  console.error("error connecting to database:", err.message)
  process.exit(1)
})

const app = express()


app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) { // Handle JSON parse error
    return res.status(400).send({ message: "Invalid JSON format" })
  }
  next()
})


app.use("/api/users", userRouter)
app.use("/api/worlds", tokenValidator, worldRouter)
app.use("/api/login", loginRouter)

module.exports = app