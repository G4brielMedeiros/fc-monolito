import request from "supertest";
import { app, sequelize } from "../express";

describe("E2E test for client", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); //substitute for "await migration.up()"
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Client 1",
        email: "example@test.com",
        document: "123456789",
        address: {
          street: "Street 1",
          number: 123,
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        },
      });

    expect(response.status).toBe(201);
  });
});
