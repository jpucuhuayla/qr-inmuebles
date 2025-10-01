import { Body, Controller, Get, Param, Post, Put, Delete, Query } from "@nestjs/common";
import { PropertiesService } from "./properties.service";

@Controller("properties")
export class PropertiesController {
  constructor(private readonly svc: PropertiesService) {}

  @Get()
  list(@Query() q: any) { return this.svc.list(q); }

  @Get(":slug")
  async bySlug(@Param("slug") slug: string) {
    const p = await this.svc.bySlug(slug);
    if (!p) return { error: "not_found" };
    const files: any = { imagenes: [], videos: [], documentos: [] };
    for (const f of (p as any).files as any[]) {
      if (f.file_type === "imagen") files.imagenes.push(f);
      if (f.file_type === "video") files.videos.push(f);
      if (f.file_type === "documento") files.documentos.push(f);
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
