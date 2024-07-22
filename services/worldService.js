const { World, Location, Event, Item, Character, Group } = require("../models/index")

async function getWorldOwner(worldId) {
  const result = await World.findOne({
    attributes: ["username"],
    where: {
      world_id: worldId
    }
  })
  if (!result) {
    return null
  }

  return result.username
}


async function createWorld(worldId, worldName, worldDescription, worldOwner) {
  const newWorld = World.build({
    world_id: worldId,
    world_name: worldName,
    world_description: worldDescription,
    username: worldOwner
  })

  await newWorld.save()
}

async function updateWorld(worldId, worldName, worldDescription, worldOwner) {
  const world = await World.findOne({
    where: {
      world_id: worldId,
      username: worldOwner
    }
  })

  if (!world) {
    throw Error()
  }

  await world.update({
    world_name: worldName,
    world_description: worldDescription
  })
}

async function listWorlds(username) {
  const worlds = await World.findAll({
    where: {
      username: username
    }
  })
  return worlds
}

async function deleteWorld(worldId) {
  const worldToDelete = await World.findOne({
    where: {
      world_id: worldId
    }
  })

  if (!worldToDelete) {
    throw Error()
  }

  await worldToDelete.destroy()
}

async function worldOverview(worldId) {

  const world = await World.findOne({
    where: {
      world_id: worldId,
    },
    include: [{
      model: Location,
      limit: 10,
      attributes: {
        exclude: ["world_id"]
      }
    },
    {
      model: Character,
      limit: 10,
      attributes: ["char_id", "char_name", "char_description", "char_morality"]

    },
    {
      model: Event,
      limit: 10,
      attributes: {
        exclude: ["world_id", "location_id"]
      },
      include: [{
        model: Location,
        attributes: ["location_name", "location_id"]
      }]
    },
    {
      model: Item,
      limit: 10,
      attributes: {
        exclude: ["world_id"]
      }
    },
    {
      model: Group,
      limit: 10,
      attributes: {
        exclude: ["world_id"]
      }
    }
    ]
  })

  if (!world) {
    throw Error()
  }
  return world
}

module.exports = {
  createWorld,
  listWorlds,
  deleteWorld,
  worldOverview,
  getWorldOwner,
  updateWorld
}