import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {

    generate: jest.fn(),
    find: jest.fn()
  }
}

const invoiceId = "invoice 1"
const invoiceItemId = "invoice item 1"
const invoiceItemId2 = "invoice item 2"

describe("Generate Invoice use case unit test", () => {


  it("should generate an invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
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

    const result = await usecase.execute(input)

    expect(repository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.items.length).toBe(2)

  })
})