const request = require("supertest")
const app = require("../app")
const { clearTestDatabase } = require("../utils/test_helpers")

let token = null
let worldId = null
let charId = null

const username = "char route test"

const character = {
  name: "some name",
  description: "description",
  birth_date: "1990-12-21",
  death_date: "2001-12-21",
  backstory: "some backstory",
  appearance: "some appearance",
  morality: "Benign"
}

const updateCharacter = {
  name: "updated name",
  description: "updated description",
  birth_date: "2001-12-20",
  death_date: "2012-12-10",
  backstory: "updated backstory",
  appearance: "updated appearance",
  morality: "Evil"
}

describe("Testing /api/worlds/characters route", () => {

  beforeAll(async () => { // set up user, login, grab token, create a world
    await clearTestDatabase(username)
    await request(app)
      .post("/api/users")
      .send({
        username: username,
        password: "pass"
      })

    const login_response = await request(app)
      .post("/api/login")
      .send({
        username: username,
        password: "pass",
      })


    token = login_response.body.token

    const create_response = await request(app)
      .post("/api/worlds")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        description: "description"
      })

    worldId = create_response.body.world_id
  })

  test("We can create a character in our world", async () => {
    const response = await request(app)
      .post(`/api/worlds/${worldId}/characters`)
      .set("Authorization", `Bearer ${token}`)
      .send(character)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("char_id")
    charId = response.body.char_id
  })


  test("We can see the character created in the worlds' overview", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.body).toHaveProperty("characters")
    expect(response.body["characters"]).toHaveLength(1)

    const created_character = response.body["characters"][0]

    expect(created_character.char_name).toEqual(character.name)
    expect(created_character.char_description).toEqual(character.description)
    expect(created_character.char_id).toEqual(charId)
    expect(created_character.char_morality).toEqual(character.morality)

  })

  test("We can see the character in the worlds' list of characters", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}/characters`)
      .set("Authorization", `Bearer ${token}`)


    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)

    const createdCharacter = response.body[0]
    expect(createdCharacter.char_name).toEqual(character.name)
    expect(createdCharacter.char_description).toEqual(character.description)
    expect(createdCharacter.char_id).toEqual(charId)
    expect(createdCharacter.char_morality).toEqual(character.morality)
    expect(createdCharacter.char_appearance).toEqual(character.appearance)
    expect(createdCharacter.char_backstory).toEqual(character.backstory)

    // slice as sqlites date type stores a very long string with exact date & time; mysql will only store yyyy-mm-dd
    expect(createdCharacter.char_birth_date.slice(0, 10)).toEqual(character.birth_date)
    expect(createdCharacter.char_death_date.slice(0, 10)).toEqual(character.death_date)

    expect(createdCharacter.location_id).toEqual(null)

  })

  test("We can see an overview of this character", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}/characters/${charId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.char_id).toEqual(charId)
    expect(response.body.world_id).toEqual(worldId)
    expect(response.body.location_id).toEqual(null)
    expect(response.body.char_name).toEqual(character.name)
    expect(response.body.char_description).toEqual(character.description)
    expect(response.body.char_birth_date.slice(0, 10)).toEqual(character.birth_date)
    expect(response.body.char_death_date.slice(0, 10)).toEqual(character.death_date)
    expect(response.body.char_appearance).toEqual(character.appearance)
    expect(response.body.char_morality).toEqual(character.morality)
    expect(response.body.items).toHaveLength(0)
    expect(response.body.groups).toHaveLength(0)
    expect(response.body.events).toHaveLength(0)
    expect(response.body.relationships).toHaveLength(0)
  })


  test("We can update this character and see the changes reflected in the overview", async () => {
    const updateResponse = await request(app)
      .put(`/api/worlds/${worldId}/characters/${charId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateCharacter)

    expect(updateResponse.statusCode).toEqual(200)


    const response = await request(app)
      .get(`/api/worlds/${worldId}/characters/${charId}`)
      .set("Authorization", `Bearer ${token}`)


    expect(response.statusCode).toEqual(200)
    expect(response.body.char_id).toEqual(charId)
    expect(response.body.world_id).toEqual(worldId)
    expect(response.body.location_id).toEqual(null)
    expect(response.body.char_name).toEqual(updateCharacter.name)
    expect(response.body.char_description).toEqual(updateCharacter.description)
    expect(response.body.char_birth_date.slice(0, 10)).toEqual(updateCharacter.birth_date)
    expect(response.body.char_death_date.slice(0, 10)).toEqual(updateCharacter.death_date)
    expect(response.body.char_appearance).toEqual(updateCharacter.appearance)
    expect(response.body.char_morality).toEqual(updateCharacter.morality)
    expect(response.body.items).toHaveLength(0)
    expect(response.body.groups).toHaveLength(0)
    expect(response.body.events).toHaveLength(0)
    expect(response.body.relationships).toHaveLength(0)

  })

  test("We can delete this character, and they will no longer show up in the worlds' list of characters", async () => {
    const delResponse = await request(app)
      .delete(`/api/worlds/${worldId}/characters/${charId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(delResponse.statusCode).toEqual(200)

    const response = await request(app)
      .get(`/api/worlds/${worldId}/characters`)
      .set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(0)
  })

  afterAll(async () => {
    await clearTestDatabase(username)
  })

})