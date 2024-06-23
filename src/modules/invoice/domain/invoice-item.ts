import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
  id?: Id
  name: string
  price: number
}

export default class InvoiceItem {

  _id: Id
  _name: string
  _price: number

  constructor(props: InvoiceItemProps) {
    this._id = props.id || new Id()
    this._name = props.name
    this._price = props.price
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name
  }

  get price() {
    return this._price
  }
}