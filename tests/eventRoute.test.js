const request = require("supertest")
const app = require("../app")
const { clearTestDatabase } = require("../utils/test_helpers")

let token = null
let worldId = null
let eventId = null

const username = "event route tests"

const event = {
  name: "event name",
  description: "event description",
  event_type: "Subplot",
  date: "2001-12-01"
}

const updatedEvent = {
  name: "updated event name",
  description: "updated event description",
  event_type: "Main",
  date: "1999-12-30"
}

describe("Testing /api/worlds/events route", () => {

  beforeAll(async () => { // set up user, login, grab token, create a world
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
    const createResponse = await request(app)
      .post("/api/worlds")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        description: "description"
      })

    worldId = createResponse.body.world_id
  })

  test("We can create an event in our world", async () => {
    const response = await request(app)
      .post(`/api/worlds/${worldId}/events`)
      .set("Authorization", `Bearer ${token}`)
      .send(event)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toHaveProperty("event_id")
    eventId = response.body.event_id
  })


  test("We can see the event created in the worlds' overview", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("events")
    expect(response.body["events"]).toHaveLength(1)

    const createdEvent = response.body["events"][0]
    expect(createdEvent.event_name).toEqual(event.name)
    expect(createdEvent.event_description).toEqual(event.description)
    expect(createdEvent.event_type).toEqual(event.event_type)

    // slice as sqlites date type stores a very long string with exact date & time; mysql will only store yyyy-mm-dd
    expect(createdEvent.event_date.slice(0, 10)).toEqual(event.date)
    expect(createdEvent.event_id).toEqual(eventId)
  })

  test("We can see the event listed in the words' list of events", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}/events`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)

    const created_event = response.body[0]

    expect(created_event.event_id).toEqual(eventId)
    expect(created_event.location).toEqual(null)
    expect(created_event.event_name).toEqual(event.name)
    expect(created_event.event_description).toEqual(event.description)
    expect(created_event.event_type).toEqual(event.event_type)
  })

  test("We can see an overview of this event", async () => {
    const response = await request(app)
      .get(`/api/worlds/${worldId}/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)

    expect(response.body.event_id).toEqual(eventId)
    expect(response.body.event_name).toEqual(event.name)
    expect(response.body.event_description).toEqual(event.description)
    expect(response.body.event_type).toEqual(event.event_type)
    expect(response.body.event_date.slice(0, 10)).toEqual(event.date)
    expect(response.body.location).toEqual(null)
    expect(response.body.characters).toHaveLength(0)
  })

  test("We can update the event, then see the changes reflected in the overview", async () => {
    const updateResponse = await request(app)
      .put(`/api/worlds/${worldId}/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedEvent)

    expect(updateResponse.statusCode).toEqual(200)

    const response = await request(app)
      .get(`/api/worlds/${worldId}/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.body.event_id).toEqual(eventId)
    expect(response.body.event_name).toEqual(updatedEvent.name)
    expect(response.body.event_description).toEqual(updatedEvent.description)
    expect(response.body.event_type).toEqual(updatedEvent.event_type)
    expect(response.body.event_date.slice(0, 10)).toEqual(updatedEvent.date)
    expect(response.body.location).toEqual(null)
    expect(response.body.characters).toHaveLength(0)
  })

  test("When we delete the event, it will no longer show up in the worlds' list of events", async () => {
    const deleteResponse = await request(app)
      .delete(`/api/worlds/${worldId}/events/${eventId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(deleteResponse.statusCode).toEqual(200)
    const response = await request(app)
      .get(`/api/worlds/${worldId}/events`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(0)
  })

  afterAll(async () => {
    await clearTestDatabase(username)
  })

})