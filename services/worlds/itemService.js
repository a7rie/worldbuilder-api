const sequelize = require("../../models/sequelize")
const { Item, Character } = require("../../models/index")
const Item_Ownership = require("../../models/Item_Ownership")

async function itemOverview(itemId, worldId) {
  const item = await Item.findOne({
    where: {
      item_id: itemId,
      world_id: worldId
    },
    include: [{
      model: Character,
      attributes: ["char_id", "char_name"],
      through: { attributes: [] }
    }]
  })

  if (!item) throw Error()
  return item
}

async function listItems(worldId) {
  const items = Item.findAll({
    where: {
      world_id: worldId
    }
  })
  return items
}

async function createItem(itemId, worldId, itemName, itemDescription, characters) {
  const transaction = await sequelize.transaction()
  try {
    await Item.create({
      item_id: itemId,
      world_id: worldId,
      item_name: itemName,
      item_description: itemDescription
    }, { transaction: transaction })

    if (characters) {
      await addItemOwners(worldId, itemId, characters, transaction)
    }

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

async function addItemOwners(worldId, itemId, characters, transaction) {
  const query = "INSERT INTO Item_Ownership VALUES (:world_id, :item_id, :char_id)"
  for (const charId of characters) {
    await sequelize.query(query, {
      replacements: {
        world_id: worldId,
        item_id: itemId,
        char_id: charId,
      },
      transaction
    })
  }
}

// async function clearItemOwners(itemId, transaction) {
//     const query = "DELETE FROM Item_Ownership WHERE item_id = :item_id"
//     await sequelize.query(query, {
//         replacements: {
//             item_id: itemId,
//         },
//         transaction
//     })
// }

async function deleteItem(itemId, worldId) {

  const itemToDelete = await Item.findOne({
    where: {
      item_id: itemId,
      world_id: worldId
    }
  })

  if (!itemToDelete) {
    throw Error("Cannot delete item that doesn't exist")
  }

  await itemToDelete.destroy()
}

async function updateItemOwners(itemId, worldId, owners) {
  const item = await Item.findOne({
    where: {
      item_id: itemId,
      world_id: worldId
    }
  })
  if (!item) {
    throw Error()
  }

  const transaction = await sequelize.transaction()
  try {
    await Item_Ownership.destroy({
      where: {
        item_id: itemId,
        world_id: worldId
      },
      transaction
    })

    for (const charId of owners) {
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

async function updateItem(itemId, worldId, itemName, itemDescription) {
  const item = await Item.findOne({
    where: {
      world_id: worldId,
      item_id: itemId
    }
  })

  if (!item) {
    throw Error()
  }

  await item.update({
    item_name: itemName ?? null,
    item_description: itemDescription ?? null
  })
}

module.exports = {
  listItems,
  createItem,
  deleteItem,
  itemOverview,
  updateItemOwners,
  updateItem
}