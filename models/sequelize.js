const config = require("../utils/config")
const { Sequelize } = require("sequelize")

let sequelize

if (process.env.NODE_ENV === "test") { // (use sqlite DB for testing)
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "tests/test.sqlite",
    logging: false
  })
} else {
  sequelize = new Sequelize(config.DATABASE_NAME, config.DATABASE_USER, config.DATABASE_PASSWORD, {
    dialect: "mysql",
    logging: false
  })
}

module.exports = sequelize