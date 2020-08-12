import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import { IProductsObject } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IProductsOrder {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError('User does not exist');
    }
    const productsOrder = [] as IProductsOrder[];
    const fullProducts = await this.productsRepository.findAllById(products);
    if (fullProducts.length !== products.length) {
      throw new AppError('One or more products do not exist');
    }

    const productsObject: IProductsObject = {};

    for (let i = 0; i < products.length; i += 1) {
      productsObject[products[i].id] = products[i].quantity;
    }

    for (let i = 0; i < fullProducts.length; i += 1) {
      const { price, id, quantity } = fullProducts[i];
      if (quantity - productsObject[id] < 0) {
        throw new AppError(
          'There are no sufficient products to fulfill this order',
        );
      }
      productsOrder.push({
        product_id: id,
        price,
        quantity: productsObject[id],
      });
    }

    const order = await this.ordersRepository.create({
      customer,
      products: productsOrder,
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateOrderService;
