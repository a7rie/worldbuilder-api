const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Location = sequelize.define("location", {
  location_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_id: {
    type: Sequelize.INTEGER
  },
  location_name: {
    type: Sequelize.STRING
  },
  location_description: {
    type: Sequelize.STRING
  },
  location_type: {
    type: Sequelize.STRING
  },
  location_population: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: "location",
  timestamps: false
})

module.exports = Location