const request = require("supertest")
const app = require("../app")
const { clearTestDatabase } = require("../utils/test_helpers")

let token = null
let worldId = null
const username = "world route tests"

describe("Testing /api/worlds route", () => {

  beforeAll(async () => { // set up user, login, grab token
    await clearTestDatabase(username)
    await request(app)
      .post("/api/users")
      .send({
        username: username,
        password: "pass"
      })

    const response = await request(app)
      .post("/api/login")
      .send({
        username: username,
        password: "pass",
      })

    token = response.body.token
  })

  test("We can create a world", async () => {
    const response = await request(app)
      .post("/api/worlds")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        description: "description"
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("world_id")
    worldId = response.body.world_id
  })

  test("We can see the world we created through the overview route", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.characters).toHaveLength(0)
    expect(response.body.events).toHaveLength(0)
    expect(response.body.groups).toHaveLength(0)
    expect(response.body.items).toHaveLength(0)
    expect(response.body.locations).toHaveLength(0)
    expect(response.body.world_description).toEqual("description")
    expect(response.body.world_name).toEqual("name")
    expect(response.body.world_id).toEqual(worldId)

  })

  test("We can update world and see the changes reflected in the overview", async () => {
    await request(app)
      .put(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "updated name",
        description: "updated description"
      })

    const response = await request(app)
      .get(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.characters).toHaveLength(0)
    expect(response.body.events).toHaveLength(0)
    expect(response.body.groups).toHaveLength(0)
    expect(response.body.items).toHaveLength(0)
    expect(response.body.locations).toHaveLength(0)
    expect(response.body.world_description).toEqual("updated description")
    expect(response.body.world_name).toEqual("updated name")
    expect(response.body.world_id).toEqual(worldId)

  })

  test("We can see this world in this users list of worlds", async () => {
    const response = await request(app)
      .get("/api/worlds/")
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)

    const world = response.body[0]
    expect(world.world_id).toEqual(worldId)
    expect(world.world_name).toEqual("updated name")
    expect(world.world_description).toEqual("updated description")
    expect(world.username).toEqual(username)

  })

  test("If we delete this world, it will no longer show up in the users list of worlds", async () => {
    const del_response = await request(app)
      .delete(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(del_response.statusCode).toEqual(200)

    const list_response = await request(app)
      .get("/api/worlds/")
      .set("Authorization", `Bearer ${token}`)


    expect(list_response.statusCode).toEqual(200)
    expect(list_response.body).toHaveLength(0)

  })

  test("Deleting a world that doesn't exist returns an error response", async () => {
    const response = await request(app)
      .delete(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(401)
    expect(response.body.error).toEqual(`${username} does not own a world with ID ${worldId}`)
  })

  afterAll(async () => {
    await clearTestDatabase(username)
  })

})