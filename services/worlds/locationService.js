const { Location, Character, Event } = require("../../models/index")

async function locationOverview(locationId, worldId) {
  const location = await Location.findOne({
    where: {
      location_id: locationId,
      world_id: worldId
    },
    include: [
      {
        model: Character,
        attributes: ["char_id", "char_name"]
      },
      {
        model: Event,
        attributes: ["event_id", "event_name", "event_date"]
      }
    ]
  })

  return location
}
async function listLocations(worldId) {
  const locations = await Location.findAll({
    where: {
      world_id: worldId
    }
  })
  return locations
}

async function createLocation(locationId, worldId, locationName, locationDescription, locationType, locationPopulation) {
  const newLocation = Location.build({
    location_id: locationId,
    world_id: worldId,
    location_name: locationName,
    location_description: locationDescription ?? null,
    location_type: locationType,
    location_population: locationPopulation ?? null
  })

  await newLocation.save()
}

async function updateLocation(locationId, worldId, locationName, locationDescription, locationType, locationPopulation) {

  const location = await Location.findOne({
    where: {
      location_id: locationId,
      world_id: worldId
    }
  })

  if (!location) {
    throw Error("Cannot update location that doesn't exist")
  }

  await location.update({
    location_name: locationName,
    location_description: locationDescription,
    location_type: locationType,
    location_population: locationPopulation
  })
}

async function deleteLocation(locationId, worldId) {
  const locationToDelete = await Location.findOne({
    where: {
      location_id: locationId,
      world_id: worldId
    }
  })

  if (!locationToDelete) {
    throw Error("Cannot delete location that doesn't exist")
  }

  await locationToDelete.destroy()
}

module.exports = {
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  locationOverview
}