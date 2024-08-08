import request from "supertest";
import { app, sequelize } from "../express";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";

describe("E2E test for invoice", () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true }); //substitute for "await migration.up()"
  });

  afterEach(async () => {
    sequelize.close();
  });

  it("should get an invoice", async () => {
    const invoice = await InvoiceModel.create(
      {
        id: "1i",
        name: "Foo Man",
        document: "12345678",
        street: "Bear Springs Drive",
        number: "150",
        complement: "Apt 101",
        city: "Winter Springs",
        state: "FL",
        zipcode: "32708",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "1",
            name: "item 1",
            price: 100,
          },
          {
            id: "2",
            name: "item 2",
            price: 200,
          },
        ],
      },
      { include: [InvoiceItemModel] }
    );

    const response = await request(app).get("/invoice/1i");
    console.log(response);
    expect(response.status).toBe(201);

    expect(response.body.id).toEqual(invoice.id);
  });
});
