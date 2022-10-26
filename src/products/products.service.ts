import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsManagerService } from 'src/common/services/errors-manager/errors-manager.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-images.entity';

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
    const images = await this.structureImages(product.images);
    return { ...product, images: images };
  }

  async structureImages(images: ProductImage[]) {
    return images.map((image) => image.url);
  }

  // eslint-disable-next-line
  async update(id: string, updateProductDto: UpdateProductDto) {
    // preload : loads the element based on the id and all its props
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });

    if (!product) throw new NotFoundException('product not found');

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      await this.errorsManager.handlingError(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete({ id });
    return true;
  }
}
