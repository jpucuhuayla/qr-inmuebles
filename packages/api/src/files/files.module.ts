import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { S3Service } from "../s3/s3.service";
import { PrismaService } from "../prisma.service";

@Module({ controllers: [FilesController], providers: [FilesService, S3Service, PrismaService] })
export class FilesModule {}
