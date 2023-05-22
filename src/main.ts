import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // CORS 미들웨어 활성화
  // cookieyParser
  // app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
