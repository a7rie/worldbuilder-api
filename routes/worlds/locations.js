const express = require("express")
const locationsRouter = express.Router({ mergeParams: true })
const locationService = require("../../services/worlds/locationService")
const validator = require("../../utils/validation")
const idGenerator = require("../../utils/idGenerator")
const formatAjvErrors = require("../../utils/formatAjvErrors")

locationsRouter.get("/", async (request, response) => {
  const worldId = request.params.worldId
  try {
    const locations = await locationService.listLocations(worldId)
    return response.status(200).json(locations)
  } catch (err) {
    return response.status(400).json({
      error: "Could not get locations for world"
    })
  }
})

locationsRouter.post("/", async (request, response) => {
  const valid = validator.validate("createLocation", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }
  const worldId = request.params.worldId
  const locationId = idGenerator()
  const { name, description, location_type, population } = request.body
  try {
    await locationService.createLocation(locationId, worldId, name, description, location_type, population)
    return response.status(201).send({ location_id: locationId })
  } catch (err) {
    return response.status(400).json({
      error: "Could not create location"
    })
  }
})

locationsRouter.put("/:locationId", async (request, response) => {
  const valid = validator.validate("createLocation", request.body)
  if (!valid) {
    const errorMessage = formatAjvErrors(validator.errors)
    return response.status(400).json({
      error: errorMessage
    })
  }
  const worldId = request.params.worldId
  const locationId = request.params.locationId
  const { name, description, location_type, population } = request.body
  try {
    await locationService.updateLocation(locationId, worldId, name, description, location_type, population)
    response.status(201).send(`Updated location with id ${locationId}`)
  } catch (err) {
    return response.status(400).json({
      error: "Could not update location"
    })
  }
})

locationsRouter.get("/:locationId", async (request, response) => {
  const worldId = request.params.worldId
  const locationId = request.params.locationId
  try {
    const overview = await locationService.locationOverview(locationId, worldId)
    return response.status(200).json(overview)
  } catch(err) {
    return response.status(400).json({
      error: "Could not get item overview"
    })
  }
})

locationsRouter.delete("/:locationId", async (request, response) => {
  const locationId = request.params.locationId
  const worldId = request.params.worldId
  try {
    await locationService.deleteLocation(locationId, worldId)
    response.status(200).send()
  } catch (err) {
    return response.status(400).json({
      error: "Could not delete location"
    })
  }
})

module.exports = locationsRouter