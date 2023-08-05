import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('port'));
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
