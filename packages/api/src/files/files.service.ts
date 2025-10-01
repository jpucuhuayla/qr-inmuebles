import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService, private s3: S3Service) {}

  buildObjectKey(title: string, tipo: "Documentos"|"Imagenes"|"Videos", filename: string) {
    const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
    return `${norm(title)}/${tipo}/${norm(filename)}`;
  }

  presignUpload(objectKey: string, contentType: string) {
    return this.s3.presignUpload(objectKey, contentType);
  }
  presignDownload(objectKey: string) {
    return this.s3.presignDownload(objectKey);
  }

  async register(property_id: string, file_type: "documento"|"imagen"|"video", object_key: string, original_name?: string, size_bytes?: number) {
    return this.prisma.propertyFile.create({ data: { property_id, file_type, object_key, original_name, size_bytes } });
  }

  async remove(fileId: string) {
    const f = await this.prisma.propertyFile.delete({ where: { id: fileId } });
    await this.s3.delete(f.object_key);
    return f;
  }
}
