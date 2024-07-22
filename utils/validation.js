const Ajv = require("ajv")
const validator = new Ajv()

const createUserSchema = require("../schemas/createUserRequest.json")
const createEventSchema = require("../schemas/createEventRequest.json")
const createCharSchema = require("../schemas/createCharRequest.json")
const createWorldSchema = require("../schemas/createWorldRequest.json")
const createGroupSchema = require("../schemas/createGroupRequest.json")
const createItemSchema = require("../schemas/createItemRequest.json")
const createLocationSchema = require("../schemas/createLocationRequest.json")
const updateItemsOwnedSchema = require("../schemas/updateItemOwnership.json")
const updateGroupsApartOfSchema = require("../schemas/updateGroupsApartOf.json")
const addCharacterRelationshipSchema = require("../schemas/addCharacterRelationship.json")
const updateEventsParticipatedSchema = require("../schemas/updateEventsParticipated.json")
const updateParticipatingCharactersSchema = require("../schemas/updateParticipatingCharacters.json")
const updateOwnersOfItemSchema = require("../schemas/updateOwnersOfItem.json")
const updateGroupMembersSchema = require("../schemas/updateGroupMembers.json")

validator.addSchema(createUserSchema, "createUser")
validator.addSchema(createEventSchema, "createEvent")
validator.addSchema(createCharSchema, "createChar")
validator.addSchema(createWorldSchema, "createWorld")
validator.addSchema(createGroupSchema, "createGroup")
validator.addSchema(createItemSchema, "createItem")
validator.addSchema(createLocationSchema, "createLocation")
validator.addSchema(updateItemsOwnedSchema, "updateItemsOwned")
validator.addSchema(updateGroupsApartOfSchema, "updateGroupsApartOf")
validator.addSchema(addCharacterRelationshipSchema, "addCharacterRelationship")
validator.addSchema(updateEventsParticipatedSchema, "updateEventsParticipated")
validator.addSchema(updateParticipatingCharactersSchema, "updateParticipatingCharacters")
validator.addSchema(updateOwnersOfItemSchema, "updateOwnersOfItem")
validator.addSchema(updateGroupMembersSchema, "updateGroupMembers")

module.exports = validator