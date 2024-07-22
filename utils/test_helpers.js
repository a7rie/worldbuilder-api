const { User } = require("../models/index")

async function clearTestDatabase(username) {
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  if (user) await user.destroy()
}

module.exports = {
  clearTestDatabase
}