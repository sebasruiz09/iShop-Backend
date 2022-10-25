import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsInt()
  @IsPositive()
  stock?: number;

  @IsString({
    // each of the elements must meet the following conditions
    each: true,
  })
  @IsArray()
  sizes: string[];

  //declare options value
  @IsIn(['men', 'women', 'kid', 'unisex'])
  @IsString()
  gender: string;

  @IsOptional()
  @IsString({
    each: true,
  })
  @IsArray()
  tags: string[];
}
