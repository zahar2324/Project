import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'crypto';
import * as argon2 from 'argon2'; 
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

interface JwtPayload {
    id: number;
    // додайте інші властивості, які є в токені
  }
  
@Injectable()

export class AuthService {
    constructor(private prisma:PrismaService, private jwt:JwtService){

    }
    // register(){
    //     return {
    //         name : 'max'
    //     }
    // }



async login(dto:AuthDto){
    const user = await this.validateUser(dto)


    const tokens = await this.issueTokens(user.id)
       // console.log('issueTokens: ', tokens)
        return {
            user: this.returnUserField(user),
            ...tokens
        }
}







    async getNewTokens(refreshToken: string){
       
/* const result =  await this.jwt.verifyAsync(refreshToken)
        if(result) throw new UnauthorizedException('infalid refresh token')

        const user = this.prisma.user.findUnique({
            where:{
                id:result.id
            }
        })

        const tokens = await this.issueTokens(user.id)

 */

        const result = await this.jwt.verifyAsync(refreshToken);

    
    if (!result) {
        throw new UnauthorizedException('Invalid refresh token');
    }


    const user = await this.prisma.user.findUnique({
        where: {
            id: result.id, 
        },
    });

    if (!user) {
        throw new UnauthorizedException('User not found');
    }

    
    const tokens = await this.issueTokens(user.id);

    return {
        user: this.returnUserField(user),
        ...tokens
    }

        
    }



    async register(dto:AuthDto){
        const oldUser = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })
        if ( oldUser) throw new BadRequestException('User is already exist')
            const user  = await this.prisma.user.create({
            data:{
                email:dto.email,
                name: faker.person.firstName(),
                phone: `+38 (${faker.number.int({ min: 100, max: 999 })}) ${faker.number.int({ min: 100, max: 999 })} ${faker.number.int({ min: 10, max: 99 })} ${faker.number.int({ min: 10, max: 99 })}`,
                password: await argon2.hash(dto.password)
            }
        })

        const tokens = await this.issueTokens(user.id)
        console.log('issueTokens: ', tokens)
        return {
            user: this.returnUserField(user),
            ...tokens
        }
    }

    private async issueTokens(userId:number){
        const data = {
            id:userId
        }
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h',

        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7h',
            
        })
        return{accessToken, refreshToken}
    }
    private returnUserField(user: User){
        return{
            id: user.id,
            email: user.email
        }
        

    }


    private async validateUser(dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        })
        if ( !user) throw new NotFoundException('User is not found')

        const isValid = await argon2.verify(user.password, dto.password) 

        if ( !isValid) throw new NotFoundException('Invalid password')
        
        return user
    }
}
