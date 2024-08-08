  import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import CheckoutRepository from "../../../modules/checkout/repository/checkout.repository";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();
  const productAdmFacade = ProductAdmFacadeFactory.create();
  const catalogFacade = StoreCatalogFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();
  const invoiceFacade = InvoiceFacadeFactory.create();
  const checkoutRepository = new CheckoutRepository();

  const placeOrderUseCase = new PlaceOrderUseCase(
    clientFacade,
    productAdmFacade,
    catalogFacade,
    checkoutRepository,
    invoiceFacade,
    paymentFacade
  );

  try {
    const output = await placeOrderUseCase.execute({
      clientId: req.body.clientId,
      products: req.body.products,
    });
    res.status(201).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
