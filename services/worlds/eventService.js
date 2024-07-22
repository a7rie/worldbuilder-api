const { Event, Location, Character, sequelize } = require("../../models/index")
const Event_Participation = require("../../models/Event_Participation")

async function createEvent(eventId, worldId, locationId, eventName, eventDescription, eventType, eventDate, characters) {
  let transaction = null
  try {
    transaction = await sequelize.transaction()
    await Event.create({
      event_id: eventId,
      world_id: worldId,
      location_id: locationId,
      event_name: eventName,
      event_description: eventDescription,
      event_type: eventType,
      event_date: eventDate
    }, { transaction })
    if (characters) {
      await addCharactersToEvent(worldId, characters, eventId, transaction)
    }
    await transaction.commit()
  }
  catch (err) {
    if (err.name === "SequelizeForeignKeyConstraintError") {
      throw Error("Event could not be created.")
    }
    await transaction.rollback()
    throw err
  }
}

async function addCharactersToEvent(worldId, characters, eventId, transaction) {
  for (const charId of characters) {
    await Event_Participation.create({
      world_id: worldId,
      char_id: charId,
      event_id: eventId
    }, { transaction })
  }
}

async function updateEvent(eventId, worldId, locationId, eventName, eventDescription, eventType, eventDate) {

  const event = await Event.findOne({
    where: {
      event_id: eventId,
      world_id: worldId
    }
  })

  if (!event) {
    throw Error()
  }

  await event.update({
    location_id: locationId,
    event_name: eventName,
    event_description: eventDescription,
    event_type: eventType,
    event_date: eventDate
  })
}

async function eventsInWorld(worldId) {
  const events = await Event.findAll({
    attributes: {
      exclude: ["world_id", "location_id"]
    },
    where: {
      world_id: worldId
    },
    include: [{
      model: Location,
      attributes: ["location_id", "location_name"]
    }]
  })

  return events
}

async function deleteEvent(eventId, worldId) {
  const eventToDelete = await Event.findOne({
    where: {
      event_id: eventId,
      world_id: worldId
    }
  })

  if (!eventToDelete) {
    throw Error("Cannot delete an event that doesn't exist")
  }

  await eventToDelete.destroy()
}

async function eventOverview(eventId, worldId) {
  const event = await Event.findOne({
    where: {
      event_id: eventId,
      world_id: worldId
    },
    attributes: {
      exclude: ["world_id", "location_id"]
    },
    include: [{
      model: Location,
      attributes: ["location_id", "location_name"]
    },
    {
      model: Character,
      attributes: ["char_id", "char_name"]
    }]

  })

  if (!event) {
    throw Error()
  }
  return event
}


async function updateParticipatingCharacters(eventId, worldId, characters) {
  const event = await Event.findOne({
    where: {
      event_id: eventId,
      world_id: worldId
    }
  })

  if (!event) {
    throw Error("Cannot update event that doesn't exist")
  }

  const transaction = await sequelize.transaction()
  try {
    await Event_Participation.destroy({
      where: {
        event_id: eventId,
        world_id: worldId
      },
      transaction
    })

    for (const charId of characters) {
      await Event_Participation.create({
        world_id: worldId,
        event_id: eventId,
        char_id: charId,
      }, {
        transaction
      })
    }
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = {
  createEvent,
  eventsInWorld,
  deleteEvent,
  eventOverview,
  updateEvent,
  updateParticipatingCharacters
}