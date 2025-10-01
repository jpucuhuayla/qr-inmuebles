import { Module } from "@nestjs/common";
import { PropertiesModule } from "./properties/properties.module";
import { FilesModule } from "./files/files.module";
import { AuthModule } from "./auth/auth.module";

@Module({ imports: [AuthModule, PropertiesModule, FilesModule] })
export class AppModule {}
