const authHelper = require("../utils/authHelper")

// when a user sends a request in the world /api/worlds/<world_id>/<world_entity>/..., validate they own the world in <world_id>. runs AFTER token validation middleware -- username should already be in request.username
const validateWorldOwnership = async (request, response, next) => {
  const username = request.username
  const worldId = request.params.worldId
  const userOwnsWorld = await authHelper.userOwnsWorld(username, worldId)
  if (!userOwnsWorld) {
    return response.status(401).json({
      error: `${username} does not own a world with ID ${worldId}`
    })
  }
  next()
}

module.exports = validateWorldOwnership