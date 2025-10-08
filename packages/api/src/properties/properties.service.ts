import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  list(query: any) {
    const where: any = {};
    if (query.district) where.district = query.district;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    return this.prisma.property.findMany({ where, orderBy: { created_at: "desc" } });
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
