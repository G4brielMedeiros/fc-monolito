import request from "supertest";
import { app, sequelize } from "../express";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { Umzug } from "umzug";
import { migrator } from "../../db/config-migrations/migrator";

describe("E2E test for invoice", () => {
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
    expect(response.status).toBe(200);

    expect(response.body.id).toEqual(invoice.id);
    expect(response.body.name).toEqual(invoice.name);
    expect(response.body.document).toEqual(invoice.document);
    expect(response.body.address.street).toEqual(invoice.street);
    expect(response.body.address.number).toEqual(invoice.number);
    expect(response.body.address.complement).toEqual(invoice.complement);
    expect(response.body.address.city).toEqual(invoice.city);
    expect(response.body.address.state).toEqual(invoice.state);
    expect(response.body.address.zipCode).toEqual(invoice.zipcode);
    expect(response.body.items.length).toEqual(2);
    expect(response.body.items[0].id).toEqual(invoice.items[0].id);
    expect(response.body.items[0].name).toEqual(invoice.items[0].name);
    expect(response.body.items[0].price).toEqual(invoice.items[0].price);
    expect(response.body.items[1].id).toEqual(invoice.items[1].id);
    expect(response.body.items[1].name).toEqual(invoice.items[1].name);
    expect(response.body.items[1].price).toEqual(invoice.items[1].price);
  });
});
