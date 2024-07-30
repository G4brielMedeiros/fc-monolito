import request from "supertest";
import { app, sequelize } from "../express";
import { migrator } from "../../db/config-migrations/migrator";
import { Umzug } from "umzug";

describe("E2E test for client", () => {
  let migration: Umzug<any>;

  beforeAll(async () => {
    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
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

    console.log(response);

    expect(response.status).toBe(201);
  });
});
