const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Item_Ownership = sequelize.define("item_ownership", {
  world_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  item_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  char_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  }
}, {
  tableName: "item_ownership",
  timestamps: false
})

module.exports = Item_Ownership