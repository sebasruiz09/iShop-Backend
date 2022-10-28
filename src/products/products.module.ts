import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CommonModule } from '../common/common.module';
import { ProductImage } from './entities/product-images.entity';

@Module({
  //import type orm module
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), CommonModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
