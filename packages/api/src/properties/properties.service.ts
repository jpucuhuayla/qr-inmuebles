import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async list(query: any) {
    const where: any = {};
    if (query.district) where.district = query.district;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;

    const properties = await this.prisma.property.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        files: {
          where: { file_type: "imagen" },
          take: 1,
          orderBy: { created_at: "asc" }
        }
      }
    });

    // Agregar la imagen principal a cada propiedad
    return properties.map(p => ({
      ...p,
      main_image: p.main_image_key || (p.files[0]?.object_key || null),
      files: undefined // No enviar todos los archivos en el listado
    }));
  }

  bySlug(slug: string) {
    return this.prisma.property.findUnique({
      where: { slug },
      include: { files: true },
    });
  }

  byId(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: { files: true },
    });
  }

  create(data: any) { return this.prisma.property.create({ data }); }
  update(id: string, data: any) { return this.prisma.property.update({ where: { id }, data }); }
  delete(id: string) { return this.prisma.property.delete({ where: { id } }); }
}
