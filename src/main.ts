import { PrismaService } from './prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const pismaService = app.get(PrismaService)
  await pismaService.enableShutdownHooks(app)
  
  app.setGlobalPrefix('api')
  app.enableCors()//про связок бекнду з фронтом якщо не поставити будуть помилки
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
