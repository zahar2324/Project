import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,PrismaService],
  imports:[
    ConfigModule,
    JwtModule.registerAsync({
   
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: getJwtConfig
    })
  ]
})
export class AuthModule {}
