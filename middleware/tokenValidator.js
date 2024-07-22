const jwt = require("jsonwebtoken")
const config = require("../utils/config")

const tokenValidator = (request, response, next) => {
  const authorization = request.headers["authorization"]

  if (!authorization) {
    return response.status(401).json({
      error: "No token provided, login before attempting to access this route."
    })
  }

  try {
    const token = authorization.replace("Bearer ", "")
    const decoded = jwt.verify(token, config.JWT_SECRET)
    request.username = decoded.username
    next()
  } catch (err) {
    return response.status(401).json({
      error: "Invalid token"
    })
  }
}

module.exports = tokenValidator