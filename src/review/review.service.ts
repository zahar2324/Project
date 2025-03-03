import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { returnReviewObject } from './return-review.object';
import { ReviewDto } from './review.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { connect } from 'http2';

@Injectable()
export class ReviewService {

    constructor(private prisma: PrismaService) {} 
    
    async getAll(){
        return this.prisma.review.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            select: returnReviewObject
        })
    }
   
    async create(userId: number, dto: ReviewDto, productId: number){
        return this.prisma.review.create({
            data : {
                ...dto,
                product:{
                    connect:{
                        id:productId
                    }
                },
                user:{
                    connect:{
                        id:userId
                    }
                }
            }
        })
    }

    async getAverageValueByProductId(productId: number) {
        return this.prisma.review
            .aggregate({
                where: { productId },
                _avg: { rating: true }
            })
            .then(data => data._avg);
            //.then(data => data._avg?.rating ?? 0); // Якщо немає оцінок, повертає 0
    }
    
    


        /* async byId(id: number) {
            const review = await this.prisma.review.findUnique({
                where: { id },
                select: returnReviewObject
            });
    
            if (!review) {
                throw new NotFoundException('Review not found'); 
            }
            return review;
        }

       
 */
       /*  async bySlug(slug: string) {
            const review = await this.prisma.review.findUnique({
                where: { slug },
                select: returnReviewObject
            });
    
            if (!review) {
                throw new NotFoundException('review not found'); 
            }
            return review;
        }
   
        async update(id: number, dto: ReviewDto) {
            return this.prisma.review.update({
                where: { id },
                data: {
                    name: dto.name,
                    slug:generateSlug(dto.name)
                }
            });
        }
        async delete(id: number) {
              return this.prisma.review.delete({
                  where: { id }
              });
          } */

}
