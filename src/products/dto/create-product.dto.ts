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
  readonly title: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly slug: true;

  @IsInt()
  @IsPositive()
  readonly stock?: true;

  @IsString({
    // each of the elements must meet the following conditions
    each: true,
  })
  @IsArray()
  readonly sizes: string[];

  //declare options value
  @IsIn(['men', 'women', 'kid', 'unisex'])
  @IsString()
  readonly gender: string;
}
