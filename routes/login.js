const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const validator = require("../utils/validation")
const userService = require("../services/userService")
const formatAjvErrors = require("../utils/formatAjvErrors")
const config = require("../utils/config")

loginRouter.post("/", async (request, response) => {
  const valid = validator.validate("createUser", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({ error: errorMessage })
  }

  const { username, password } = request.body
  try {
    const passwordHash = await userService.getPasswordHash(username)
    const passwordCorrect = await bcrypt.compare(password, passwordHash)

    if (!passwordCorrect) {
      throw Error()
    }
    const expireTime = config.TOKEN_EXPIRE_TIME_SECONDS
    const token = jwt.sign({ username }, config.JWT_SECRET, { expiresIn: expireTime })
    return response.status(200).json({ username, token })
  } catch (err) {
    return response.status(400).json({
      error: "Either password is incorrect, or user does not exist."
    })
  }

})

module.exports = loginRouter