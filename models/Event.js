const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Event = sequelize.define("event", {
  event_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  world_id: {
    type: Sequelize.INTEGER
  },
  location_id: {
    type: Sequelize.INTEGER
  },
  event_name: {
    type: Sequelize.STRING
  },
  event_description: {
    type: Sequelize.STRING
  },
  event_type: {
    type: Sequelize.STRING
  },
  event_date: {
    type: Sequelize.DATE
  },
}, {
  tableName: "event",
  timestamps: false
})

module.exports = Event