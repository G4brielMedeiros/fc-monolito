import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/invoice-item"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"



const invoiceId = "invoice 1"
const invoiceItemId = "invoice item 1"
const invoiceItemId2 = "invoice item 2"

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

const MockRepository = () => {

  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find a invoice", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: invoiceId
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address).toEqual(invoice.address)
    expect(result.createdAt).toEqual(invoice.createdAt)
    expect(result.items.length).toBe(2)
  })
})