const sequelize = require("./sequelize")
const User = require("./User")
const World = require("./World")
const Character = require("./Character")
const Event = require("./Event")
const Group = require("./Group")
const Item = require("./Item")
const Location = require("./Location")
const Event_Participation = require("./Event_Participation")
const Group_Characters = require("./Group_Characters")
const Item_Ownership = require("./Item_Ownership")
const Character_Relationships = require("./Character_Relationships")

// User.hasMany(World, { foreignKey: 'username', onDelete: "cascade", hooks: true  })


World.hasMany(Character, { foreignKey: "world_id" })
Character.belongsTo(Character, { foreignKey: "world_id" })

World.hasMany(Location, { foreignKey: "world_id" })
Location.belongsTo(World, { foreignKey: "world_id" })

World.hasMany(Event, { foreignKey: "world_id" })
Event.belongsTo(World, { foreignKey: "world_id" })

World.hasMany(Group, { foreignKey: "world_id" })
Group.belongsTo(World, { foreignKey: "world_id" })

World.hasMany(Item, { foreignKey: "world_id" })
Item.belongsTo(World, { foreignKey: "world_id" })

World.hasMany(Group, { foreignKey: "world_id" })
Group.belongsTo(World, { foreignKey: "world_id" })

Event.belongsTo(Location, { foreignKey: "location_id" })
Location.hasMany(Event, { foreignKey: "location_id" })

Event.belongsToMany(Character, { through: Event_Participation, foreignKey: "event_id" })
Character.belongsToMany(Event, { through: Event_Participation, foreignKey: "char_id" })

Group.belongsToMany(Character, { through: Group_Characters, foreignKey: "group_id" })
Character.belongsToMany(Group, { through: Group_Characters, foreignKey: "char_id" })

Item.belongsToMany(Character, { through: Item_Ownership, foreignKey: "item_id" })
Character.belongsToMany(Item, { through: Item_Ownership, foreignKey: "char_id" })

Character.belongsTo(Location, { foreignKey: "location_id" })
Location.hasMany(Character, { foreignKey: "location_id" })

Character.belongsToMany(Character, { through: Character_Relationships, foreignKey: "char1_id", as: "CR1" })
Character.belongsToMany(Character, { through: Character_Relationships, foreignKey: "char2_id", as: "CR2" })


module.exports = {
  sequelize,
  User,
  World,
  Character,
  Event,
  Group,
  Item,
  Location
}