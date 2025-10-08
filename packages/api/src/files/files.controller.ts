import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly svc: FilesService) {}

  @Post("presign-upload")
  async presign(@Body() body: { fileName: string; fileType: string }) {
    // Validar tipos permitidos (acepta jpeg, jpg, png, mp4, pdf)
    const contentType = body.fileType;
    if (!/^application\/pdf$|^image\/(jpeg|jpg|png)$|^video\/mp4$/.test(contentType)) {
      throw new Error("Tipo no permitido");
    }

    // Generar una key única para el archivo
    const timestamp = Date.now();
    const safeName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${timestamp}-${safeName}`;

    const url = await this.svc.presignUpload(key, contentType);
    return { url, key };
  }

  @Get("presign-download")
  async d(@Query("objectKey") objectKey: string) { return { url: await this.svc.presignDownload(objectKey) }; }

  @Post(":propertyId/register")
  async register(@Param("propertyId") propertyId: string, @Body() body: { objectKey: string; originalName: string; fileType: string; sizeBytes?: number }) {
    // Detectar el tipo de archivo basado en el MIME type
    let file_type: "documento" | "imagen" | "video";
    if (body.fileType.startsWith("image/")) {
      file_type = "imagen";
    } else if (body.fileType.startsWith("video/")) {
      file_type = "video";
    } else if (body.fileType === "application/pdf") {
      file_type = "documento";
    } else {
      throw new Error("Tipo de archivo no soportado");
    }

    // Convertir sizeBytes a BigInt si existe
    const size_bytes = body.sizeBytes ? BigInt(body.sizeBytes) : undefined;

    const result = await this.svc.register(propertyId, file_type, body.objectKey, body.originalName, size_bytes);

    // Convertir BigInt a string para JSON
    return {
      ...result,
      size_bytes: result.size_bytes ? result.size_bytes.toString() : null,
    };
  }

  @Delete(":fileId")
  remove(@Param("fileId") fileId: string) { return this.svc.remove(fileId); }
}
