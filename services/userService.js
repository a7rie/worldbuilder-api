const { User } = require("../models/index")

async function createUser(username, passwordHash) {
  const newUser = User.build({
    username: username,
    password_hash: passwordHash
  })

  await newUser.save()
}

async function getPasswordHash(username) {
  const result = await User.findOne({
    attributes: ["password_hash"],
    where: {
      username: username
    }
  })
  if (!result) throw Error()
  return result.password_hash
}

module.exports = {
  createUser,
  getPasswordHash
}