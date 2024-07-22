const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Group = sequelize.define("group", {
  group_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_id: {
    type: Sequelize.INTEGER
  },
  group_name: {
    type: Sequelize.STRING
  },
  group_description: {
    type: Sequelize.STRING
  }
}, {
  tableName: "group",
  timestamps: false
})

module.exports = Group