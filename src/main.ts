import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { USER_IMAGE_LOCATION } from './misc/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'https://mariemllr.github.io/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // serve userImages statically
  [USER_IMAGE_LOCATION].forEach((location) =>
    app.useStaticAssets(join(__dirname, '..', location), {
      prefix: `${location.replace('public', '').replaceAll('\\', '/')}/`,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
