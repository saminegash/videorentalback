const { Rental } = require("../../models/rental");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };
  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "samuel",
        phone: "0923181210",
      },
      movie: {
        _id: movieId,
        title: "Movie title",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    const res = await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
    expect(res.status).toBe(400);
  });
});
