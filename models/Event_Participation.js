const Sequelize = require("sequelize")
const sequelize = require("./sequelize")

const Event_Participation = sequelize.define("event_participation", {
  world_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  char_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  event_id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
}, {
  tableName: "event_participation",
  timestamps: false
})

module.exports = Event_Participation