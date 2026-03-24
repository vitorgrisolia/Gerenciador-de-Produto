// src/products/products.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

type ProductResponse = Product & {
  missingLetter: string;
};

type SqliteConstraintError = {
  code?: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private findMissingLetter(name: string): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const normalizedName = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    for (const letter of alphabet) {
      if (!normalizedName.includes(letter)) {
        return letter;
      }
    }

    return '_';
  }

  private formatProductResponse(product: Product): ProductResponse {
    return {
      ...product,
      missingLetter: this.findMissingLetter(product.name),
    };
  }

  private handlePersistenceError(error: unknown, sku: string): never {
    if (error instanceof QueryFailedError) {
      const queryError = error as QueryFailedError & {
        driverError?: SqliteConstraintError;
      };
      const constraintCode = queryError.driverError?.code;

      if (
        typeof constraintCode === 'string' &&
        constraintCode.includes('SQLITE_CONSTRAINT')
      ) {
        throw new ConflictException(`Já existe um produto com SKU "${sku}".`);
      }
    }

    throw error;
  }

  private async saveProduct(product: Product): Promise<ProductResponse> {
    try {
      const savedProduct = await this.productRepository.save(product);
      return this.formatProductResponse(savedProduct);
    } catch (error) {
      this.handlePersistenceError(error, product.sku);
    }
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponse> {
    const product = this.productRepository.create(createProductDto);
    return this.saveProduct(product);
  }

  async findAll(): Promise<ProductResponse[]> {
    const products = await this.productRepository.find({
      order: {
        name: 'ASC',
      },
    });

    return products.map((product) => this.formatProductResponse(product));
  }

  async findOne(id: string): Promise<ProductResponse> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }

    return this.formatProductResponse(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    const productEntity = await this.productRepository.findOneBy({ id });

    if (!productEntity) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }

    Object.assign(productEntity, updateProductDto);

    return this.saveProduct(productEntity);
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado.`);
    }

    return { message: 'Produto removido com sucesso.' };
  }
}
