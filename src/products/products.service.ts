import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ErrorsManagerService } from 'src/common/services/errors-manager/errors-manager.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-images.entity';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    //inject-repository
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly errorsManager: ErrorsManagerService,

    //inject images repository
    @InjectRepository(ProductImage)
    private readonly productImage: Repository<ProductImage>,

    //inject dataSource
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImage.create({ url: image })),
      });
      await this.productRepository.save(product);

      return { ...product, images: images };
    } catch (error) {
      return this.errorsManager.handlingError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      // display the relationship data in the request
      relations: {
        images: true,
      },
    });
    setTimeout(() => 10000);
    // flatten response
    return product.map(({ images, ...product }) => ({
      ...product,
      images: images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queyBuilder = this.productRepository
        // alias to table first table to query
        .createQueryBuilder('prod');
      product = await queyBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        // left join to other table
        // alias is required in case another join is needed
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

      // product.images = product.images.map((image) => image.url);
    }
    //query builder concept

    // const product = await this.productRepository.findOneBy({ id: term});
    if (!product) throw new NotFoundException();

    return product;
  }

  // eslint-disable-next-line
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    console.log('Query runner created');
    await queryRunner.connect();
    // all steps add to query runner
    await queryRunner.startTransaction();

    try {
      if (images) {
        //delete is eliminated register
        //softdelete change estatus in active or inactive
        //params is very important to cancel delete * from ....
        await queryRunner.manager.delete(ProductImage, {
          product: { id },
        });

        product.images = images.map((image) =>
          this.productImage.create({ url: image }),
        );
        // await this.productRepository.save(product);
        await queryRunner.manager.save(product);

        //send all process saved in queryRunner
        await queryRunner.commitTransaction();

        //query runner close clonnection
        await queryRunner.release();
        return await this.findOnePlain(id);
      }
    } catch (error) {
      console.log(error);
      //capture some error cancel all query runner procedures
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.errorsManager.handlingError(error);
    }
  }

  async findOnePlain(term: string) {
    const { images, ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete({ id });
    return true;
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.errorsManager.handlingError(error);
    }
  }
}
