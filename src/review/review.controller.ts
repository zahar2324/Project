import { Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ReviewDto } from './review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


      @UsePipes(new ValidationPipe())
      @Get()
      async getAll() { 
        return this.reviewService.getAll();
      }




      /* @Get('by-slug/:slug')
      async getBySlug(@Param('slug') slug:string) { 
        return this.categoryService.bySlug(slug);
      }
      @Get(':id')
      @Auth()
      async getById(@Param('id') id:string) { 
        return this.categoryService.byId(+id);
      }
      @HttpCode(200)
      @Auth()
      @Post()
      async create() { 
        return this.categoryService.create();
      } */
        @UsePipes(new ValidationPipe())
        @HttpCode(200)
        @Post('leave/:productId')
        @Auth()
        async leaveReview(
            @CurrentUser('id') id: number,
            @Body() dto: ReviewDto,
            @Param('productId') productId: string
        ) {
            return this.reviewService.create(id, dto, +productId);
        }
        
       /*  @Auth()
        @HttpCode(200)
        @Delete(':id')
        async delete(
         @Param('id')  categoryId:string,
        )
         {
          return this.categoryService.delete(+categoryId);
        } */
}
 