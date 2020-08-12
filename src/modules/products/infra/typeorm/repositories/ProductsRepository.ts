import { getRepository, Repository } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

export interface IProductsObject {
  [key: string]: number;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: { name },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const all_products = await this.ormRepository.findByIds(products);

    return all_products;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsObject: IProductsObject = {};

    for (let i = 0; i < products.length; i += 1) {
      productsObject[products[i].id] = products[i].quantity;
    }

    const productsUpdate = await this.ormRepository.findByIds(products);

    for (let i = 0; i < productsUpdate.length; i += 1) {
      productsUpdate[i].quantity -= productsObject[productsUpdate[i].id];
    }

    await this.ormRepository.save(productsUpdate);

    return productsUpdate;
  }
}

export default ProductsRepository;
