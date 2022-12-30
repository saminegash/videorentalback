const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

describe("auth middleware", () => {
  let token;

  const exec = async() => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };
  beforeEach(async () => {
    server = require("../../index");
    token = await new User().generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  
  it("should return 401 if no token is provided", async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });
});
