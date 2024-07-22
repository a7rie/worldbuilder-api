const express = require("express")
const groupsRouter = express.Router({ mergeParams: true })
const groupService = require("../../services/worlds/groupService")
const validator = require("../../utils/validation")
const idGenerator = require("../../utils/idGenerator")
const formatAjvErrors = require("../../utils/formatAjvErrors")

groupsRouter.get("/", async (request, response) => {
  const worldId = request.params.worldId
  try {
    const responseData = await groupService.listGroups(worldId)
    return response.status(200).json(responseData)
  } catch (err) {
    response.status(400).json({
      error: "Could not get groups for world"
    })
  }
})

groupsRouter.post("/", async (request, response) => {
  const valid = validator.validate("createGroup", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const id = idGenerator()
  const worldId = request.params.worldId
  const { name, description, characters } = request.body

  try {
    await groupService.createGroup(id, worldId, name, description, characters)
    return response.status(201).json({ group_id: id })
  } catch (err) {
    response.status(400).json({
      error: "Could not create group"
    })
  }
})

groupsRouter.put("/:groupId", async (request, response) => {
  const valid = validator.validate("createGroup", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const groupId = request.params.groupId
  const worldId = request.params.worldId
  const { name, description } = request.body

  try {
    await groupService.updateGroup(worldId, groupId, name, description)
    response.status(200).json({ group_id: groupId })
  } catch (err) {
    response.status(400).json({
      error: "Could not update group"
    })
  }
})

groupsRouter.get("/:groupId", async (request, response) => {
  const worldId = request.params.worldId
  const groupId = request.params.groupId
  try {
    const overview = await groupService.groupOverview(worldId, groupId)
    response.status(200).json(overview)
  } catch (err) {
    response.status(400).json({
      error: "Could not retrieve group overview"
    })
  }
})

groupsRouter.delete("/:groupId", async (request, response) => {
  const groupId = request.params.groupId
  const worldId = request.params.worldId

  try {
    await groupService.deleteGroup(groupId, worldId)
    response.status(200).json({ group_id: groupId })
  } catch (err) {
    response.status(400).json({
      error: "Could not delete group"
    })
  }
})

groupsRouter.put("/:groupId/members", async (request, response) => {
  const valid = validator.validate("updateOwnersOfItem", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }
  const { characters } = request.body
  const groupId = request.params.groupId
  const worldId = request.params.worldId
  try {
    await groupService.updateMembersOfGroup(worldId, groupId, characters)
    response.status(200).end()
  } catch(err) {
    response.status(400).json({
      error: "Could not update members of group"
    })
  }

})

module.exports = groupsRouter