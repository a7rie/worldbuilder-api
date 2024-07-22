const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Character = sequelize.define("character", {
  char_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_id: {
    type: Sequelize.INTEGER
  },
  location_id: {
    type: Sequelize.INTEGER
  },
  char_name: {
    type: Sequelize.STRING
  },
  char_description: {
    type: Sequelize.STRING
  },
  char_birth_date: {
    type: Sequelize.DATE
  },
  char_death_date: {
    type: Sequelize.DATE
  },
  char_backstory: {
    type: Sequelize.STRING
  },
  char_appearance: {
    type: Sequelize.STRING
  },
  char_morality: {
    type: Sequelize.STRING
  }
}, {
  tableName: "character",
  timestamps: false
})

module.exports = Character