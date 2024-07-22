const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  password_hash: {
    type: Sequelize.STRING
  },
  date_created: {
    type: Sequelize.DATE
  },
  is_admin: {
    type: Sequelize.BOOLEAN
  }
}, {
  tableName: "user",
  timestamps: false
})

module.exports = User