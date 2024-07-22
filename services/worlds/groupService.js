const sequelize = require("../../models/sequelize")
const { Group, Character } = require("../../models/index")
const Group_Characters = require("../../models/Group_Characters")

async function listGroups(worldId) {
  const groups = await Group.findAll({
    where: {
      world_id: worldId
    }
  })
  return groups
}

async function createGroup(groupId, worldId, groupName, groupDescription, characters) {
  const transaction = await sequelize.transaction()

  try {
    await Group.create({
      group_id: groupId,
      world_id: worldId,
      group_name: groupName,
      group_description: groupDescription ?? null
    }, { transaction: transaction })

    if (characters) {
      await populateGroup(worldId, groupId, characters, transaction)
    }

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }

}

async function deleteGroup(groupId, worldId) {
  const groupToDelete = await Group.findOne({
    where: {
      group_id: groupId,
      world_id: worldId
    }
  })

  if (!groupToDelete) {
    throw Error("Cannot delete group that doesn't exist")
  }

  await groupToDelete.destroy()
}

// only adds statements to the transaction passed -- does not execute any SQL.
async function populateGroup(worldId, groupId, characters, transaction) {
  const query = "INSERT INTO Group_characters VALUES (:world_id, :group_id, :char_id)"
  for (const charId of characters) {
    await sequelize.query(query,
      {
        replacements: {
          world_id: worldId,
          group_id: groupId,
          char_id: charId,
        },
        transaction
      })
  }
}


async function updateGroup(worldId, groupId, groupName, groupDescription) {
  const group = await Group.findOne({
    where: {
      group_id: groupId,
      world_id: worldId
    }
  })

  if (!group) {
    throw Error("Group to update doesn't exist")
  }

  await group.update({
    group_name: groupName,
    group_description: groupDescription
  })
}

async function groupOverview(worldId, groupId) {
  const group = await Group.findOne({
    where: {
      world_id: worldId,
      group_id: groupId
    },
    include: [{
      model: Character,
      attributes: ["char_id", "char_name", "char_description", "char_morality"],
      through: { attributes: [] },
    }]
  })

  if (!group) {
    throw Error()
  }
  return group
}

async function updateMembersOfGroup(worldId, groupId, members) {
  const group = await Group.findOne({
    where: {
      group_id: groupId,
      world_id: worldId
    }
  })
  if (!group) {
    throw Error()
  }

  const transaction = await sequelize.transaction()
  try {
    await Group_Characters.destroy({
      where: {
        group_id: groupId,
        world_id: worldId
      },
      transaction
    })

    for (const charId of members) {
      await Group_Characters.create({
        char_id: charId,
        world_id: worldId,
        group_id: groupId
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
  listGroups,
  createGroup,
  deleteGroup,
  updateGroup,
  groupOverview,
  updateMembersOfGroup
}