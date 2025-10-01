import { api } from "@/lib/api";
import Uploader from "@/components/Uploader";

async function getById(id: string) {
  const list = await api("/properties");
  const p = list.find((x: any)=>x.id===id);
  if (!p) return null;
  return p;
}

export default async function Edit({ params }: { params: { id: string } }) {
  const property = await getById(params.id);
  if (!property) return <main className="p-6">No encontrado</main> as any;
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">{property.title}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Uploader property={property} tipo="Imagenes" />
        <Uploader property={property} tipo="Videos" />
        <Uploader property={property} tipo="Documentos" />
      </div>
    </main>
  );
}
