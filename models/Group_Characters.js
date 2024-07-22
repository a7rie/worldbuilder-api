const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Group_Characters = sequelize.define("group_characters", {
  world_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  group_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  char_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
}, {
  tableName: "group_characters",
  timestamps: false
})

module.exports = Group_Characters