const usersRouter = require("express").Router()
const bcrypt = require("bcrypt")
const userService = require("../services/userService")
const validator = require("../utils/validation")
const formatAjvErrors = require("../utils/formatAjvErrors")
const jwt = require("jsonwebtoken")
const config = require("../utils/config")


usersRouter.post("/", async (request, response) => {
  const valid = validator.validate("createUser", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({ error: errorMessage })
  }

  const { username, password } = request.body
  const password_hash = await bcrypt.hash(password, 10)

  try {
    await userService.createUser(username, password_hash)
    const expireTime = config.TOKEN_EXPIRE_TIME_SECONDS
    const token = jwt.sign({ username }, config.JWT_SECRET, { expiresIn: expireTime })
    return response.status(201).json({ username, token })
  } catch (err) {
    return response.status(400).json({
      error: err.message
    })
  }
})



module.exports = usersRouter