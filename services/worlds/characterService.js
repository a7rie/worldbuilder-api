const sequelize = require("../../models/sequelize")
const { Character } = require("../../models/index")
const Item_Ownership = require("../../models/Item_Ownership")
const Group_Characters = require("../../models/Group_Characters")
const Character_Relationships = require("../../models/Character_Relationships")
const Event_Participation = require("../../models/Event_Participation")

async function createCharacter(charId, locationId, worldId, charName, charDescription, charBirth, charBackstory, charDeath,
  charAppearance, charMorality) {
  try {
    const newCharacter = Character.build({
      char_id: charId,
      world_id: worldId,
      location_id: locationId ?? null,
      char_name: charName,
      char_description: charDescription ?? null,
      char_birth_date: charBirth ?? null,
      char_backstory: charBackstory ?? null,
      char_death_date: charDeath ?? null,
      char_appearance: charAppearance ?? null,
      char_morality: charMorality ?? null
    })
    await newCharacter.save()
  } catch (err) {
    throw Error("Character could not be created.")
  }
}

async function updateCharacter(charId, locationId, worldId, charName, charDescription, charBirth, charBackstory, charDeath,
  charAppearance, charMorality) {
  const character = await Character.findOne({
    where: {
      world_id: worldId,
      char_id: charId
    }
  })

  if (!character) {
    throw Error()
  }
  await character.update({
    location_id: locationId ?? null,
    char_name: charName,
    char_description: charDescription ?? null,
    char_birth_date: charBirth ?? null,
    char_backstory: charBackstory ?? null,
    char_death_date: charDeath ?? null,
    char_appearance: charAppearance ?? null,
    char_morality: charMorality ?? null
  })
}

async function charactersInWorld(worldId) {
  const characters = await Character.findAll({
    attributes: {
      exclude: ["world_id"]
    },
    where: {
      world_id: worldId
    }
  })
  return characters
}

async function deleteCharacter(charId, worldId) {
  const charToDelete = await Character.findOne({
    where: {
      char_id: charId,
      world_id: worldId
    }
  })

  if (!charToDelete) {
    throw Error("Cannot delete character that doesn't exist")
  }

  await charToDelete.destroy()
}

async function characterOverview(charId, worldId) {
  const charDetailsQuery = "SELECT * FROM `Character` WHERE char_id = :char_id AND world_id = :world_id"

  const itemsOwnedQuery = `SELECT I.item_id, I.item_name, I.item_description FROM Item AS I Join Item_Ownership 
  AS OW ON I.item_id = OW.item_id AND OW.char_id = :char_id AND I.world_id = :world_id`

  const groupsJoinedQuery = `SELECT G.group_id, G.group_name FROM \`Group\` AS G JOIN Group_Characters 
  AS GC ON G.group_id = GC.group_id AND GC.char_id = :char_id WHERE G.world_id = :world_id`

  const eventsParticipatedQuery = "SELECT E.event_id, E.event_name, E.event_type FROM Event As E JOIN Event_participation as EP ON E.event_id = EP.event_id WHERE EP.char_id = :char_id AND E.world_id = :world_id"

  const relationshipsQuery = `SELECT CR.char1_id, 
                                    C1.char_name AS char1_name, 
                                    CR.char2_id, 
                                    C2.char_name AS char2_name,
                                    CR.relationship_type,
                                    CR.relationship_description
                                    FROM 
                                        Character_Relationships AS CR
                                    JOIN 
                                        \`Character\` AS C1 ON CR.char1_id = C1.char_id
                                    JOIN 
                                        \`Character\` AS C2 ON CR.char2_id = C2.char_id
                                    WHERE 
                                        CR.char1_id = :char_id OR CR.char2_id = :char_id
                                        AND CR.world_id = :world_id`

  const locationQuery = "SELECT L.location_name, L.location_id FROM Location AS L JOIN `Character` AS C ON C.location_id = L.location_id WHERE C.char_id = :char_id AND L.world_id = :world_id"

  const sequelizeOptions = {
    replacements: {
      char_id: charId,
      world_id: worldId
    },
    type: sequelize.QueryTypes.SELECT
  }


  const promises = [
    sequelize.query(charDetailsQuery, sequelizeOptions),
    sequelize.query(itemsOwnedQuery, sequelizeOptions),
    sequelize.query(groupsJoinedQuery, sequelizeOptions),
    sequelize.query(eventsParticipatedQuery, sequelizeOptions),
    sequelize.query(relationshipsQuery, sequelizeOptions),
    sequelize.query(locationQuery, sequelizeOptions),
  ]


  let [charDetails, itemsOwned, groupsJoined, eventsParticipated, relationships, location] = await Promise.all(promises)

  if (charDetails.length === 0) {
    throw Error(`Character with ID ${charId} doesn't exist.`)
  }

  const charObj = charDetails[0]

  // ensure unidirectional mapping from given char -> relationship char
  relationships = relationships.map(relationship => {
    let { char1_id, char2_id, char1_name, char2_name } = relationship
    delete relationship.char1_id
    delete relationship.char2_id
    delete relationship.char1_name
    delete relationship.char2_name
    if (char1_id === charId) {
      relationship["char_id"] = char2_id
      relationship["char_name"] = char2_name
    } else {
      relationship["char_id"] = char1_id
      relationship["char_name"] = char1_name
    }
    return relationship
  })

  if (location && location.length > 0) {
    location = location[0]
  } else {
    location = null
  }

  charObj["items"] = itemsOwned
  charObj["groups"] = groupsJoined
  charObj["events"] = eventsParticipated
  charObj["relationships"] = relationships
  charObj["location"] = location

  return charObj
}


async function updateItemsOwned(charId, worldId, items) {
  const char = await Character.findOne({
    where: {
      char_id: charId,
      world_id: worldId
    }
  })
  if (!char) {
    throw Error("Cannot update character that doesn't exist")
  }

  const transaction = await sequelize.transaction()
  try {
    await Item_Ownership.destroy({
      where: {
        char_id: charId,
        world_id: worldId
      },
      transaction
    })

    for (const itemId of items) {
      await Item_Ownership.create({
        char_id: charId,
        world_id: worldId,
        item_id: itemId
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

async function updateGroupsApartOf(charId, worldId, groups) {
  const char = await Character.findOne({
    where: {
      char_id: charId,
      world_id: worldId
    }
  })

  if (!char) {
    throw Error("Cannot update character that doesn't exist")
  }

  const transaction = await sequelize.transaction()
  try {
    await Group_Characters.destroy({
      where: {
        char_id: charId,
        world_id: worldId
      },
      transaction
    })

    for (const groupId of groups) {
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

async function addRelationship(worldId, char1Id, char2Id, relationshipType, relationshipDescription) {
  try {
    const newRelationship = Character_Relationships.build({
      world_id: worldId,
      char1_id: char1Id,
      char2_id: char2Id,
      relationship_type: relationshipType,
      relationship_description: relationshipDescription
    })
    await newRelationship.save()
  } catch (err) {
    throw Error("Relationship could not be created.")
  }
}

async function deleteRelationship(worldId, char1Id, char2Id) {

  try {
    const relationship = await Character_Relationships.findOne({
      where: {
        world_id: worldId,
        char1_id: char1Id,
        char2_id: char2Id,
      }
    })

    if (relationship === null) {
      throw Error()
    }
    await relationship.destroy()
  } catch(err) {
    throw Error("Relationship could not be deleted.")
  }
}

async function updateEventsParticipated(charId, worldId, events) {
  const char = await Character.findOne({
    where: {
      char_id: charId,
      world_id: worldId
    }
  })

  if (!char) {
    throw Error("Cannot update character that doesn't exist")
  }

  const transaction = await sequelize.transaction()
  try {
    await Event_Participation.destroy({
      where: {
        char_id: charId,
        world_id: worldId
      },
      transaction
    })

    for (const eventId of events) {
      await Event_Participation.create({
        world_id: worldId,
        char_id: charId,
        event_id: eventId
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
  createCharacter,
  charactersInWorld,
  deleteCharacter,
  characterOverview,
  updateCharacter,
  updateItemsOwned,
  updateGroupsApartOf,
  addRelationship,
  deleteRelationship,
  updateEventsParticipated
}