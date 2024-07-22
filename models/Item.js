const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Item = sequelize.define("item", {
  item_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_id: {
    type: Sequelize.INTEGER
  },
  item_name: {
    type: Sequelize.STRING
  },
  item_description: {
    type: Sequelize.STRING
  }
}, {
  tableName: "item",
  timestamps: false
})

module.exports = Item