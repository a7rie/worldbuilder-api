const request = require("supertest")
const app = require("../app")
const { clearTestDatabase } = require("../utils/test_helpers")

const username = "user route tests"
describe("We can create a user and login with it", () => {
  beforeAll(async () => {
    await clearTestDatabase(username)
  })

  test("should create a new user", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({
        username: username,
        password: "pass",
      })
    expect(response.statusCode).toEqual(201)
  })

  test("we can login with our user", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        username: username,
        password: "pass",
      })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty("username")
    expect(response.body).toHaveProperty("token")
  })

  test("logging in with the wrong password returns a 400 error", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        username: username,
        password: "incorrect",
      })
    expect(response.statusCode).toEqual(400)
  })


  afterAll(async () => {
    await clearTestDatabase(username)
  })

})