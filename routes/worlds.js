const worldsRouter = require("express").Router()
const worldService = require("../services/worldService")
const charactersRouter = require("./worlds/characters")
const eventsRouter = require("./worlds/events")
const itemsRouter = require("./worlds/items")
const groupsRouter = require("./worlds/groups")
const locationsRouter = require("./worlds/locations")
const idGenerator = require("../utils/idGenerator")
const formatAjvErrors = require("../utils/formatAjvErrors")
const validator = require("../utils/validation")
const validateWorldOwnership = require("../middleware/validateWorldOwnership")

worldsRouter.get("/", async (request, response) => {
  try {
    const username = request.username
    const listOfWorlds = await worldService.listWorlds(username)
    return response.status(200).json(listOfWorlds)
  } catch (err) {
    return response.status(400).json({
      error: "Could not get list of worlds"
    })
  }
})

worldsRouter.post("/", async (request, response) => {
  const valid = validator.validate("createWorld", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({ error: errorMessage })
  }

  const username = request.username
  const { name, description } = request.body
  const id = idGenerator()

  try {
    await worldService.createWorld(id, name, description, username)
    return response.status(201).json({
      world_id: id
    })
  } catch (err) {
    return response.status(400).json({
      error: "Could not create world"
    })
  }
})

worldsRouter.put("/:worldId", async (request, response) => {
  const valid = validator.validate("createWorld", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({ error: errorMessage })
  }

  const username = request.username
  const { name, description } = request.body
  const id = request.params.worldId
  try {
    await worldService.updateWorld(id, name, description, username)
    return response.status(200).json({
      world_id: id
    })
  } catch (err) {
    return response.status(400).json({
      error: "Could not update world"
    })
  }
})

worldsRouter.delete("/:worldId", validateWorldOwnership, async (request, response) => {
  const id = request.params.worldId
  try {
    await worldService.deleteWorld(id)
    return response.status(200).end()
  } catch (err) {
    return response.status(400).json({
      error: "Could not delete world"
    })
  }
})

worldsRouter.get("/:worldId/", validateWorldOwnership, async (request, response) => {
  const id = request.params.worldId
  try {
    const responseData = await worldService.worldOverview(id)
    return response.status(200).json(responseData)
  } catch (err) {
    console.error(err)
    return response.status(400).json({
      error: "Could not get world overview"
    })
  }
})


worldsRouter.use("/:worldId/characters", validateWorldOwnership, charactersRouter)
worldsRouter.use("/:worldId/events", validateWorldOwnership, eventsRouter)
worldsRouter.use("/:worldId/items", validateWorldOwnership, itemsRouter)
worldsRouter.use("/:worldId/groups", validateWorldOwnership, groupsRouter)
worldsRouter.use("/:worldId/locations", validateWorldOwnership, locationsRouter)

module.exports = worldsRouter