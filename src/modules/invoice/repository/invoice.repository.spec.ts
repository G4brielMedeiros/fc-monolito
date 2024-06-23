import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-item"
import { InvoiceItemModel } from "./invoice-item.model"

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  const invoiceId = "invoice 1"
  const invoiceItemId = "invoice item 1"
  const invoiceItemId2 = "invoice item 2"

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

    const invoice = new Invoice({
      id: new Id(invoiceId),
      name: "My Invoice",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItem({
          id: new Id(invoiceItemId),
          name: "invoice item",
          price: 99
        }),
        new InvoiceItem({
          id: new Id(invoiceItemId2),
          name: "invoice item 2",
          price: 99
        })
      ]
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const result = await InvoiceModel.findOne({ where: { id: invoiceId }, include: [InvoiceItemModel] })

    expect(result).toBeDefined()
    expect(result.id).toEqual(invoice.id.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.street).toEqual(invoice.address.street)
    expect(result.number).toEqual(invoice.address.number)
    expect(result.complement).toEqual(invoice.address.complement)
    expect(result.city).toEqual(invoice.address.city)
    expect(result.state).toEqual(invoice.address.state)
    expect(result.zipcode).toEqual(invoice.address.zipCode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(result.items.length).toBe(2)
  })

  it("should find a invoice", async () => {

    const invoice = await InvoiceModel.create({
      id: invoiceId,
      name: 'Lucian',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        new InvoiceItemModel({
          id: invoiceItemId,
          name: "invoice item",
          price: 99
        }),
        new InvoiceItemModel({
          id: invoiceItemId2,
          name: "invoice item2",
          price: 99
        })
      ]
    }, {
      include: [InvoiceItemModel]
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(result.items.length).toBe(2)
  })
})