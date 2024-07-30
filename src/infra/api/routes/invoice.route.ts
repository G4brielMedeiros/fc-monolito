import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { AddProductFacadeInputDto } from "../../../modules/product-adm/facade/product-adm.facade.interface";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import { FindInvoiceFacadeInputDto } from "../../../modules/invoice/facade/invoice.facade.interface";

export const invoiceRoute = express.Router();

invoiceRoute.post("/:id", async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create();

  try {
    const findDto: FindInvoiceFacadeInputDto = {
      id: req.params.id,
    };

    const invoice = await invoiceFacade.find(findDto);

    res.status(201).send(invoice);
  } catch (err) {
    res.status(500).send(err);
  }
});
