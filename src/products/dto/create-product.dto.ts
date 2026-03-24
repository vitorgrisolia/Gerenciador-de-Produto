import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O preço deve ser um número válido com até 2 casas decimais.' },
  )
  @IsPositive({ message: 'O preço deve ser maior que zero.' })
  price: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'O SKU deve conter exatamente 3 caracteres.' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'O SKU deve conter exatamente 3 letras.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  sku: string;
}
