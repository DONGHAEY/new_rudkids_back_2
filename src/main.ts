import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, 'http://192.168.0.6:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // strategy: 'excludeAll',
      // excludeExtraneousValues: true,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
