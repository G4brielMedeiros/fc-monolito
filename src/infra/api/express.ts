import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import { ClientCheckoutModel } from "../modules/checkout/repository/client.model";
import { OrderProductModel } from "../modules/checkout/repository/order-product.model";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { ProductCheckoutModel } from "../modules/checkout/repository/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { ProductModel } from "../modules/product-adm/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
// app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    ProductModel,
    ClientModel,
    ProductCheckoutModel,
    ClientCheckoutModel,
    OrderModel,
    OrderProductModel,
  ]);
  await sequelize.sync();
}

setupDb();
