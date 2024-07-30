import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        status: order.status,
        products: order.products.map((item) => ({
          id: item.id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
        })),
      },
      { include: [OrderModel.associations.products] }
    );
  }
  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findByPk(id, {
      include: [{ all: true, nested: true }],
    });

    const address = new Address(
      order.client.street,
      order.client.number,
      order.client.complement,
      order.client.city,
      order.client.state,
      order.client.zipcode
    );
    return new Order({
      id: new Id(order.id),
      client: new Client({
        id: new Id(order.clientId),
        name: order.client.name,
        email: order.client.email,
        document: order.client.document,
        address: address.street,
      }),
      products: order.products.map((item) => {
        return new Product({
          id: new Id(item.id),
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
        });
      }),
    });
  }
}
