const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const World = sequelize.define("world", {
  world_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_name: {
    type: Sequelize.STRING
  },
  world_description: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  }
}, {
  tableName: "world",
  timestamps: false
})

module.exports = World