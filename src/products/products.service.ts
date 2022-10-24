import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsManagerService } from 'src/common/services/errors-manager/errors-manager.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    //inject-repository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly errorsManager: ErrorsManagerService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      return this.errorsManager.handlingError(error);
    }
  }

  async findAll() {
    const products = this.productRepository.find();
    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    return product;
  }

  // eslint-disable-next-line
  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete({ id });
    return true;
  }
}
