import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FilesService } from "./files.service";

@Controller("files")
export class FilesController {
  constructor(private readonly svc: FilesService) {}

  @Post("presign-upload")
  async presign(@Body() body: { objectKey: string; contentType: string }) {
    if (!/^application\/pdf$|^image\/jpeg$|^video\/mp4$/.test(body.contentType)) throw new Error("Tipo no permitido");
    const url = await this.svc.presignUpload(body.objectKey, body.contentType);
    return { url };
  }

  @Get("presign-download")
  async d(@Query("objectKey") objectKey: string) { return { url: await this.svc.presignDownload(objectKey) }; }

  @Post(":propertyId/register")
  register(@Param("propertyId") propertyId: string, @Body() body: { file_type: "documento"|"imagen"|"video"; object_key: string; original_name?: string; size_bytes?: number }) {
    return this.svc.register(propertyId, body.file_type, body.object_key, body.original_name, body.size_bytes);
  }

  @Delete(":fileId")
  remove(@Param("fileId") fileId: string) { return this.svc.remove(fileId); }
}
