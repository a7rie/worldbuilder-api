const express = require("express")
const itemsRouter = express.Router({ mergeParams: true })
const itemService = require("../../services/worlds/itemService")
const validator = require("../../utils/validation")
const idGenerator = require("../../utils/idGenerator")
const formatAjvErrors = require("../../utils/formatAjvErrors")

itemsRouter.get("/", async (request, response) => {
  const worldId = request.params.worldId
  try {
    const items = await itemService.listItems(worldId)
    return response.status(200).json(items)
  } catch (err) {
    return response.status(400).json({
      error: "Could not get items for world"
    })
  }
})

itemsRouter.post("/", async (request, response) => {
  const valid = validator.validate("createItem", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const itemId = idGenerator()
  const worldId = request.params.worldId
  const { name, description, characters } = request.body
  try {
    await itemService.createItem(itemId, worldId, name, description, characters)
    return response.status(201).json({ item_id: itemId })
  } catch(err) {
    return response.status(400).json({
      error: "Could not create item"
    })
  }
})

itemsRouter.get("/:itemId", async (request, response) => {
  const itemId = request.params.itemId
  const worldId = request.params.worldId
  try {
    const overview = await itemService.itemOverview(itemId, worldId)
    return response.status(200).json(overview)
  } catch(err) {
    return response.status(400).json({
      error: "Could not get item overview"
    })
  }
})

itemsRouter.delete("/:itemId", async (request, response) => {
  const itemId = request.params.itemId
  const worldId = request.params.worldId
  try {
    await itemService.deleteItem(itemId, worldId)
    response.status(200).send(`Deleted item with id ${itemId}`)
  } catch(err) {
    return response.status(400).json({
      error: "Could not delete item"
    })
  }
})

itemsRouter.put("/:itemId", async (request, response) => {
  const valid = validator.validate("createItem", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }
  const itemId = request.params.itemId
  const worldId = request.params.worldId
  const { name, description } = request.body
  try {
    await itemService.updateItem(itemId, worldId, name, description)
    response.status(200).send()
  } catch(err) {
    console.log(err)
    return response.status(400).json({
      error: "Could not update item"
    })
  }
})

itemsRouter.put("/:itemId/owners", async (request, response) => {
  const valid = validator.validate("updateOwnersOfItem", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const itemId = request.params.itemId
  const worldId = request.params.worldId
  const { characters } = request.body
  try {
    await itemService.updateItemOwners(itemId, worldId, characters)
    response.status(200).send()
  } catch(err) {
    return response.status(400).json({
      error: "Could not update item owners"
    })
  }
})

module.exports = itemsRouter