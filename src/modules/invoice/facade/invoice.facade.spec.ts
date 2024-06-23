import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import Address from "../../@shared/domain/value-object/address"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { InvoiceItemModel } from "../repository/invoice-item.model"

const invoiceId = "invoice 1"
const invoiceItemId = "invoice item 1"
const invoiceItemId2 = "invoice item 2"

describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const repository = new InvoiceRepository()
    const generateUsecase = new GenerateInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      generateUsecase: generateUsecase,
      findUsecase: undefined,
    })

    const input = {
      id: "1",
      name: "My Invoice",
      document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      items: [
        {
          id: invoiceItemId,
          name: "invoice item",
          price: 99
        },
        {
          id: invoiceItemId2,
          name: "invoice item 2",
          price: 99
        }
      ]
    }

    await facade.generate(input)

    const invoice = await InvoiceModel.findOne({ include: [InvoiceItemModel] })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBeDefined()
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.street).toBe(input.street)
  })

  it("should find a invoice", async () => {

    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: "1",
      name: "My Invoice",
      document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
      items: [
        {
          id: invoiceItemId,
          name: "invoice item",
          price: 99
        },
        {
          id: invoiceItemId2,
          name: "invoice item 2",
          price: 99
        }
      ]
    }

    await facade.generate(input)

    const invoice = await facade.find({ id: "1" })

    expect(invoice).toBeDefined()
    expect(invoice.id).toBe(input.id)
    expect(invoice.name).toBe(input.name)
    expect(invoice.document).toBe(input.document)
    expect(invoice.address.street).toBe(input.street)
    expect(invoice.address.number).toBe(input.number)
    expect(invoice.address.complement).toBe(input.complement)
    expect(invoice.address.city).toBe(input.city)
    expect(invoice.address.state).toBe(input.state)
    expect(invoice.address.zipCode).toBe(input.zipCode)
  })
})