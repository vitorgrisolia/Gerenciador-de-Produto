// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Lógica da letra ausente
  private findMissingLetter(name: string): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const lowerCaseName = name.toLowerCase();

    for (const letter of alphabet) {
      if (!lowerCaseName.includes(letter)) {
        return letter;
      }
    }
    return '_';
  }

  // Método auxiliar para formatar a resposta
  private formatProductResponse(product: Product): any {
    return {
      ...product,
      missing_letter: this.findMissingLetter(product.name),
    };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll() {
    const products = await this.productRepository.find({
      order: {
        name: 'ASC', // Ordena pelo nome
      },
    });
    return products.map(product => this.formatProductResponse(product));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return this.formatProductResponse(product);
  }

async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
  // Sua lógica de atualização do DB
  const productEntity = await this.productRepository.findOneBy({ id });
  if (!productEntity) {
    throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
  }
  // Atualiza as propriedades do produto
  Object.assign(productEntity, updateProductDto);
  const updatedProduct = await this.productRepository.save(productEntity);
  return this.formatProductResponse(updatedProduct);
}

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return { message: 'Product successfully deleted' };
  }
}