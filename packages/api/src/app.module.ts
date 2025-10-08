import { Module } from "@nestjs/common";
import { PropertiesModule } from "./properties/properties.module";
import { FilesModule } from "./files/files.module";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";

@Module({
  imports: [AuthModule, PropertiesModule, FilesModule],
  controllers: [AppController],
})
export class AppModule {}
