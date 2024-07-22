const express = require("express")
const charactersRouter = express.Router({ mergeParams: true })
const characterService = require("../../services/worlds/characterService")
const validator = require("../../utils/validation")
const idGenerator = require("../../utils/idGenerator")
const formatAjvErrors = require("../../utils/formatAjvErrors")

charactersRouter.get("/", async (request, response) => {
  try {
    const id = request.params.worldId
    const chars = await characterService.charactersInWorld(id)
    return response.status(200).json(chars)
  } catch (err) {
    return response.status(400).json({
      error: "Could not retrieve characters for world"
    })
  }
})

charactersRouter.post("/", async (request, response) => {
  const valid = validator.validate("createChar", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const id = idGenerator()
  const worldId = request.params.worldId
  const { name, location_id, description, birth_date, death_date, backstory, appearance, morality } = request.body
  try {
    await characterService.createCharacter(id, location_id, worldId, name, description, birth_date, backstory, death_date, appearance, morality)
    return response.status(201).json({ char_id: id })
  } catch (err) {
    return response.status(400).json({
      error: "Could not create character"
    })
  }
})

charactersRouter.put("/:characterId", async (request, response) => {
  const valid = validator.validate("createChar", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const worldId = request.params.worldId
  const charId = request.params.characterId
  const { name, location_id, description, birth_date, death_date, backstory, appearance, morality } = request.body

  try {
    await characterService.updateCharacter(charId, location_id, worldId, name, description, birth_date, backstory, death_date, appearance, morality)
    return response.status(200).json({ char_id: charId })
  } catch (err) {
    return response.status(400).json({
      error: "Could not create character"
    })
  }
})

charactersRouter.get("/:characterId", async (request, response) => {
  try {
    const charId = request.params.characterId
    const worldId = request.params.worldId
    const overview = await characterService.characterOverview(charId, worldId)
    response.status(200).json(overview)
  } catch (err) {
    response.status(400).json({
      error: "Could not retrieve character details"
    })
  }
})

charactersRouter.delete("/:characterId", async (request, response) => {
  try {
    const id = request.params.characterId
    const worldId = request.params.worldId
    await characterService.deleteCharacter(id, worldId)
    response.status(200).end()
  } catch (err) {
    response.status(400).json({
      error: "Could not delete characters"
    })
  }
})

charactersRouter.put("/:characterId/itemsOwned", async (request, response) => {
  const valid = validator.validate("updateItemsOwned", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  try {
    const { itemsOwned } = request.body
    const id = request.params.characterId
    const worldId = request.params.worldId
    await characterService.updateItemsOwned(id, worldId, itemsOwned)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not update items owned for character"
    })
  }
})

charactersRouter.put("/:characterId/groups", async (request, response) => {
  const valid = validator.validate("updateGroupsApartOf", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  try {
    const { groups } = request.body
    const id = request.params.characterId
    const worldId = request.params.worldId
    await characterService.updateGroupsApartOf(id, worldId, groups)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not update groups that character is apart of"
    })
  }
})

charactersRouter.post("/:characterId/relationships", async (request, response) => {
  const valid = validator.validate("addCharacterRelationship", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  try {
    const routedCharId = request.params.characterId
    const { char_id, relationship_type, relationship_description } = request.body
    if (char_id === routedCharId) throw Error()

    const worldId = request.params.worldId
    await characterService.addRelationship(worldId, routedCharId, char_id, relationship_type, relationship_description)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not add relationship for character"
    })
  }
})

charactersRouter.delete("/:char1Id/relationships/:char2Id", async (request, response) => {
  try {
    const { worldId, char1Id, char2Id } = request.params
    await characterService.deleteRelationship(worldId,char1Id,char2Id)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not delete relationship for character"
    })
  }
})


charactersRouter.put("/:characterId/eventsParticipated", async (request, response) => {
  const valid = validator.validate("updateEventsParticipated", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  try {
    const { events } = request.body
    const id = request.params.characterId
    const worldId = request.params.worldId
    await characterService.updateEventsParticipated(id, worldId, events)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not update events for character"
    })
  }
})

module.exports = charactersRouter