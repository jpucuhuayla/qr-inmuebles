import { api } from "@/lib/api";

export default async function Property({ params }: { params: { slug: string } }) {
  const data = await api(`/properties/${params.slug}`);
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.files.imagenes.map((img: any) => (
          <img key={img.id} src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(img.object_key)}`} alt={img.original_name || "imagen"} className="rounded-xl w-full h-40 object-cover" />
        ))}
      </div>
      <section className="mt-8">
        <h2 className="font-semibold mb-2">Documentos (PDF)</h2>
        <ul className="list-disc pl-6">
          {data.files.documentos.map((d: any) => (
            <li key={d.id}><a href={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(d.object_key)}`} target="_blank">{d.original_name || d.object_key}</a></li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-semibold mb-2">Videos (MP4)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {data.files.videos.map((v: any) => (
            <video key={v.id} src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(v.object_key)}`} controls className="w-full rounded-xl" />
          ))}
        </div>
      </section>
    </main>
  );
}
