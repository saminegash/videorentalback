const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;
describe("/api/genres", () => {
  let token;
  let name;
  const exec = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: name });
  };
  beforeEach(async () => {
    server = require("../../index");
    token = await new User().generateAuthToken();
    name = 'genre1'
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1"));
      expect(res.body.some((g) => g.name === "genre2"));
    });
  });

  describe("Get /:id", () => {
    it("should return a genre if a valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if a invalid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 char", async () => {
      name = 'ger'
      const res = await exec()

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is less than 5 char", async () => {
      name = new Array(55).join("a");
      const res = await exec()

      expect(res.status).toBe(400);
    });

    it("should save ther genre if it is valid", async () => {
      const res = await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should save ther genre if it is valid", async () => {
      const res = await exec()
      expect(res.body).toHaveProperty("name", res.body.name);
      expect(res.body).toHaveProperty("_id", res.body._id);
    });
  });
});
