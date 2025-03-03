//import { OrderItem } from './../../node_modules/.prisma/client/index.d';
import { UserService } from './../user/user.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatisticsService {

    constructor(
        private prisma: PrismaService,
        private userService: UserService
    ) {}

    async getMain(userId: number){
        const user = await this.userService.byId(userId,{
            orders:{
                select:{
                    items:{ //true,
                        select:{
                            price:true
                        }
                    }

                }
            },
            reviews:true
        })

        //return user.orders

        return [//допистаи тут щоб нормально виводилося
            {
                name: 'Orders',
                value: user.orders.length
            },
            {
                name: 'Review',
                value: user.reviews.length
            },
            {
                name: 'Favorites',
                value: user.favorites.length
            },
            {
                name: 'Total amount',
                value: 1000
            },
           
        ]

    }
}
