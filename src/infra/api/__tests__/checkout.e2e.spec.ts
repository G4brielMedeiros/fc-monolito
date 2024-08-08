import request from "supertest";
import { app, sequelize } from "../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../../modules/store-catalog/repository/product.model";

describe("E2E test for checkout", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); //substitute for "await migration.up()"
    await ProductModel.sync({ alter: true });
    await StoreCatalogProductModel.sync({ alter: true });
  });



  it("should checkout an order", async () => {
    const client = await ClientModel.create({
      id: "c1",
      name: "Lucian",
      email: "lucian@123.com",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await StoreCatalogProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await StoreCatalogProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 200,
      salesPrice: 200,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: client.id,
        products: [{ productId: "1" }, { productId: "2" }],
      });
    console.log(response);

    expect(response.status).toBe(201);
  });
});
