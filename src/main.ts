import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpResponseInterceptor } from './shared/interceptors/http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap();
