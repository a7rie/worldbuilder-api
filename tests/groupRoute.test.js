
let token = null
let worldId = null
const app = require("../app")
const request = require("supertest")
const { clearTestDatabase } = require("../utils/test_helpers")

const username = "group route tests"

let characters = [{
  name: "1",
  description: "description",
  birth_date: "1990-12-21",
  death_date: "2001-12-21",
  backstory: "some backstory",
  appearance: "some appearance",
  morality: "Benign",
  id: null
}, {
  name: "2",
  description: "description",
  birth_date: "1990-12-21",
  death_date: "2001-12-21",
  backstory: "a backstory",
  appearance: "an appearance",
  morality: "Evil",
  id: null
}]

let group = {
  name: "group name",
  description: "group description",
  characters: []
}

describe("Testing /api/worlds/groups route", () => {

  beforeAll(async () => { // set up user, login, grab token, create a world, add characters to world
    await clearTestDatabase(username)
    await request(app)
      .post("/api/users")
      .send({
        username: username,
        password: "pass"
      })

    const loginResponse = await request(app)
      .post("/api/login")
      .send({
        username: username,
        password: "pass",
      })

    token = loginResponse.body.token
    const createWorldResponse = await request(app)
      .post("/api/worlds")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        description: "description"
      })

    worldId = createWorldResponse.body.world_id
    for (var character of characters) {
      const charResponse = await request(app)
        .post(`/api/worlds/${worldId}/characters`)
        .set("Authorization", `Bearer ${token}`)
        .send(character)
      expect(charResponse.statusCode).toEqual(201)
      character.id = charResponse.body.char_id
    }
  })



  test("We can create a group in our world", async () => {
    const characterIds = characters.map(c => c.id)
    group.characters = characterIds

    const createGroupResponse = await request(app)
      .post(`/api/worlds/${worldId}/groups`)
      .set("Authorization", `Bearer ${token}`)
      .send(group)

    expect(createGroupResponse.statusCode).toEqual(201)
    group.id = createGroupResponse.body.group_id
  })

  test("We can see this group in this worlds' overview", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    const responseGroups = response.body.groups
    expect(responseGroups).toHaveLength(1)
    expect(responseGroups[0].group_id).toEqual(group.id)
    expect(responseGroups[0].group_name).toEqual(group.name)
    expect(responseGroups[0].group_description).toEqual(group.description)
  })

  test("We can see an overview for this group", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}/groups/${group.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body.group_id).toEqual(group.id)
    expect(response.body.group_name).toEqual(group.name)
    expect(response.body.group_description).toEqual(group.description)
    expect(response.body.characters).toHaveLength(characters.length)

    response.body.characters.forEach((charFromResponse, i) => {
      const localChar = characters.find(char => char.id == charFromResponse.char_id)
      expect(localChar.name).toEqual(charFromResponse.char_name)
      expect(localChar.description).toEqual(charFromResponse.char_description)
      expect(localChar.morality).toEqual(charFromResponse.char_morality)
    })
  })

  test("This group shows up in this worlds list of groups", async () => {

  })
  test("We can update this group, then see the changes reflected in the overview", async () => {
    group.characters.pop()
    const updateGroupResponse = await request(app)
      .put(`/api/worlds/${worldId}/groups/${group.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(group)

    expect(updateGroupResponse.statusCode).toEqual(200)

    const overviewResponse = await request(app)
      .get(`/api/worlds/${worldId}/groups/${group.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(overviewResponse.statusCode).toEqual(200)

    expect(overviewResponse.body.group_id).toEqual(group.id)
    expect(overviewResponse.body.group_name).toEqual(group.name)
    expect(overviewResponse.body.group_description).toEqual(group.description)
    expect(overviewResponse.body.characters).toHaveLength(characters.length )

    overviewResponse.body.characters.forEach(charFromResponse => {
      const localChar = characters.find(char => char.id == charFromResponse.char_id)
      expect(localChar.name).toEqual(charFromResponse.char_name)
      expect(localChar.description).toEqual(charFromResponse.char_description)
      expect(localChar.morality).toEqual(charFromResponse.char_morality)
    })

  })

  test("We can delete this character, and it will no longer show up in the worlds' list of groups", async () => {

  })

  afterAll(async () => {
    await clearTestDatabase(username)
  })

})
