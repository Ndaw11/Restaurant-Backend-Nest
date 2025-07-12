import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // autorise les requêtes venant du frontend
  });
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
