import { Body, Controller, Get, Param, Post, Put, Delete, Query } from "@nestjs/common";
import { PropertiesService } from "./properties.service";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly svc: PropertiesService) {}

  @Get()
  list(@Query() q: any) { return this.svc.list(q); }

  @Get(":slugOrId")
  async bySlugOrId(@Param("slugOrId") slugOrId: string) {
    // Si parece un UUID, buscar por ID, si no, por slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    const p = isUUID ? await this.svc.byId(slugOrId) : await this.svc.bySlug(slugOrId);

    if (!p) return { error: "not_found" };

    const files: any = { imagenes: [], videos: [], documentos: [] };
    for (const f of (p as any).files as any[]) {
      // Convertir BigInt a string para evitar errores de serialización
      const fileWithStringSize = {
        ...f,
        size_bytes: f.size_bytes ? f.size_bytes.toString() : null,
      };

      if (f.file_type === "imagen") files.imagenes.push(fileWithStringSize);
      if (f.file_type === "video") files.videos.push(fileWithStringSize);
      if (f.file_type === "documento") files.documentos.push(fileWithStringSize);
    }
    return { ...p, files };
  }

  @Post()
  create(@Body() body: any) { return this.svc.create(body); }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(":id")
  delete(@Param("id") id: string) { return this.svc.delete(id); }
}
