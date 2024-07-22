const worldService = require("../services/worldService")

async function userOwnsWorld(username, worldId) {
  const worldOwner = await worldService.getWorldOwner(worldId)
  return worldOwner === username
}


module.exports = { userOwnsWorld }