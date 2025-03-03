import { PaginationService } from './../pagination/pagination.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { productReturnObject, productReturnObjectFullest } from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private  paginationService: PaginationService
    ){}
    
    async getAll(dto: GetAllProductDto = {}) {
        const { sort, searchTerm } = dto;
    
        const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];
    
        if (sort === EnumProductSort.LOW_PRICE) {
            prismaSort.push({ price: 'asc' });
        } else if (sort === EnumProductSort.HIGH_PRICE) {
            prismaSort.push({ price: 'desc' });
        }else if (sort === EnumProductSort.OLDEST) {
            prismaSort.push({ createAt: 'asc' });
        } else {
            prismaSort.push({ createAt: 'desc' });
        }
    

        const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
    ? {
          OR: [
              {
                  category: {
                      name: {
                          contains: searchTerm,
                          mode: 'insensitive',
                      },
                  },
              },
              {
                  name: {
                      contains: searchTerm,
                      mode: 'insensitive',
                  },
              },
              {
                  description: {
                      contains: searchTerm,
                      mode: 'insensitive',
                  },
              },
          ],
      }
    : {};

        //return prismaSort;

        const {perPage,  skip} =  this.paginationService.getPagination(dto)

        const products = await this.prisma.product.findMany({
            where: prismaSearchTermFilter,
            orderBy: prismaSort,
            skip: skip,
            take: perPage,
        });
        
        return {
            products,
            length: await this.prisma.product.count({
                where: prismaSearchTermFilter,
            }),
        };
        
    }


            async byId(id: number) {
                const product = await this.prisma.product.findUnique({
                    where: { id },
                    select: productReturnObjectFullest
                });
        
                if (!product) {
                    throw new NotFoundException('product not found'); 
                }
                return product;
            }
    



            async bySlug(slug: string) {
                const product = await this.prisma.product.findUnique({
                    where: { slug },
                    select: productReturnObjectFullest
                });
        
                if (!product) {
                    throw new NotFoundException('Category not found'); 
                }
                return product;
            }
    
            async getbyCategory(categorySlug: string) {
                const products = await this.prisma.product.findMany({
                    where: {
                        category: {
                            slug: categorySlug.toLowerCase()
                        }
                    },
                    select: productReturnObjectFullest
                });
            
                if (!products.length) {
                    throw new NotFoundException('Products not found!');
                }
            
                return products;
            }
            

            async getSimilar(id: number) {
                const currentProduct = await this.byId(id);
            
                if (!currentProduct.category) {
                    throw new NotFoundException('Current product does not have a category!');
                }
            
                const products = await this.prisma.product.findMany({
                    where: {
                        category: {
                            name: currentProduct.category.name
                        },
                        NOT: {
                            id: currentProduct.id
                        }
                    },
                    orderBy: {
                        createAt: 'desc'
                    },
                    select: productReturnObject
                });
            
                return products;
            }
            
            async create(){
                const product = await this.prisma.product.create({
                    data : {
                        name:'',
                        slug:'',
                        price:0,
                        description:''

                    }
                })
                return product.id
            }



            async update(id: number, dto: ProductDto) {
                const { description, images, price, name, categoryId } = dto;
                
                // Перевірка чи існує категорія в базі даних
                const categoryExists = await this.prisma.category.findUnique({
                    where: { id: categoryId }
                });
            
                if (!categoryExists) {
                    throw new NotFoundException(`Category with ID ${categoryId} not found`);
                }
            
                try {
                    const updatedProduct = await this.prisma.product.update({
                        where: { id },
                        data: {
                            description,
                            images,
                            price,
                            name,
                            slug: generateSlug(name).toLowerCase(),
                            category: { connect: { id: categoryId } },
                        },
                    });
            
                    return updatedProduct;
                } catch (error) {
                    console.error("Error updating product: ", error);
                    throw new Error("Failed to update product");
                }
            }
            /*async update(id: number, dto: ProductDto) {
                const { description, images, price, name, categoryId } = dto;
            
                return this.prisma.product.update({
                    where: { id },
                    data: {
                        description,
                        images,
                        price,
                        name,
                        slug: generateSlug(name).toLowerCase(),
                        category:  { connect: { id: categoryId } } 
                    }
                });
              
            }*/
            
            async delete(id: number) {
                return this.prisma.product.delete({
                    where: { id }
                });
            }

/* 

            async create(){
                return this.prisma.product.create({
                    data : {
                        name:'',
                        slug:''
                    }
                })
            }
            async update(id: number, dto: ProductDto) {
                return this.prisma.product.update({
                    where: { id },
                    data: {
                        name: dto.name,
                        slug:generateSlug(dto.name)
                    }
                });
            }
            async delete(id: number) {
                  return this.prisma.product.delete({
                      where: { id }
                  });
              } */
    
}





