import { Prisma } from '@prisma/client';
import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsString({ each: true })
    @ArrayMinSize(1)
    images: string[];

    @IsOptional()
    @IsNumber()
    categoryId?: number;
}
