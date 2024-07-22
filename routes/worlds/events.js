const express = require("express")
const eventsRouter = express.Router({ mergeParams: true })
const idGenerator = require("../../utils/idGenerator")
const validator = require("../../utils/validation")
const eventService = require("../../services/worlds/eventService")
const formatAjvErrors = require("../../utils/formatAjvErrors")

eventsRouter.get("/", async (request, response) => {
  const worldId = request.params.worldId
  try {
    const responseData = await eventService.eventsInWorld(worldId)
    return response.status(200).json(responseData)
  } catch (err) {
    return response.status(400).json({
      error: err.message
    })
  }
})

eventsRouter.post("/", async (request, response) => {
  const valid = validator.validate("createEvent", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const id = idGenerator()
  try {
    const worldId = request.params.worldId
    const { name, location_id, description, event_type, date, characters } = request.body
    await eventService.createEvent(id, worldId, location_id, name, description, event_type, date, characters)
    return response.status(201).json({
      event_id: id
    })
  } catch (err) {
    return response.status(400).json({
      error: "Could not create event"
    })
  }
})

eventsRouter.put("/:eventId", async (request, response) => {
  const valid = validator.validate("createEvent", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const eventId = request.params.eventId
  const worldId = request.params.worldId
  const { name, location_id, description, event_type, date } = request.body

  try {
    await eventService.updateEvent(eventId, worldId, location_id, name, description, event_type, date)
    return response.status(200).json({
      event_id: eventId
    })
  } catch (err) {
    console.error(err)
    return response.status(400).json({
      error: "Could not update event"
    })
  }

})

eventsRouter.get("/:eventId", async (request, response) => {
  const eventId = request.params.eventId
  const worldId = request.params.worldId
  try {
    const overview = await eventService.eventOverview(eventId, worldId)
    response.status(200).json(overview)
  } catch (err) {
    return response.status(400).json({
      error: "Could not get event overview"
    })
  }

})


eventsRouter.delete("/:eventId", async (request, response) => {
  const eventId = request.params.eventId
  const worldId = request.params.worldId
  try {
    await eventService.deleteEvent(eventId, worldId)
    response.status(200).end()
  } catch (err) {
    return response.status(400).json({
      error: "Could not delete event"
    })
  }
})


eventsRouter.put("/:eventId/participatingCharacters", async (request, response) => {
  const valid = validator.validate("updateParticipatingCharacters", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }

  const eventId = request.params.eventId
  const worldId = request.params.worldId
  const { characters } = request.body

  try {
    await eventService.updateParticipatingCharacters(eventId, worldId, characters)
    response.status(200).end()
  } catch (err) {
    return response.status(400).json({
      error: "Could not update participating characters of event"
    })
  }
})


module.exports = eventsRouter