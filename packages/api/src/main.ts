import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true }));
  const port = process.env.PORT || 3001;
  await app.listen(Number(port));
  console.log(`API listening on :${port}`);
}
bootstrap();
