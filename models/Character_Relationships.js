const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Character_Relationships = sequelize.define("character_relationships", {
  world_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  char1_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  char2_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  relationship_type: {
    type: Sequelize.STRING
  },
  relationship_description: {
    type: Sequelize.STRING
  }
}, {
  tableName: "character_relationships",
  timestamps: false
})

module.exports = Character_Relationships