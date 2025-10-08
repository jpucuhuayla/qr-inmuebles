import { api } from "@/lib/api";

export default async function Property({ params }: { params: { slug: string } }) {
  const data = await api(`/properties/${params.slug}`);
  const hasImages = data.files?.imagenes?.length > 0;
  const hasDocuments = data.files?.documentos?.length > 0;
  const hasVideos = data.files?.videos?.length > 0;

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p className="text-gray-600 mt-2">{data.district}</p>

      {/* Sección de Imágenes */}
      {hasImages && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Imágenes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.files.imagenes.map((img: any) => (
              <img
                key={img.id}
                src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(img.object_key)}`}
                alt={img.original_name || "imagen"}
                className="rounded-xl w-full h-40 object-cover hover:opacity-90 transition cursor-pointer"
              />
            ))}
          </div>
        </section>
      )}

      {/* Sección de Documentos */}
      {hasDocuments && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Documentos (PDF)</h2>
          <ul className="space-y-2">
            {data.files.documentos.map((d: any) => (
              <li key={d.id}>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(d.object_key)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition"
                >
                  📄 {d.original_name || d.object_key}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Sección de Videos */}
      {hasVideos && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Videos (MP4)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.files.videos.map((v: any) => (
              <video
                key={v.id}
                src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(v.object_key)}`}
                controls
                className="w-full rounded-xl shadow-lg"
              />
            ))}
          </div>
        </section>
      )}

      {/* Mensaje si no hay archivos */}
      {!hasImages && !hasDocuments && !hasVideos && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg text-center text-gray-600">
          No hay archivos disponibles para esta propiedad
        </div>
      )}
    </main>
  );
}
