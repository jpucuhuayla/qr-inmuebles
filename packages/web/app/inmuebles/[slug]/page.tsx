import { api } from "@/lib/api";

export default async function Property({ params }: { params: { slug: string } }) {
  const data = await api(`/properties/${params.slug}`);
  const hasImages = data.files?.imagenes?.length > 0;
  const hasDocuments = data.files?.documentos?.length > 0;
  const hasVideos = data.files?.videos?.length > 0;

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold font-arial">{data.title}</h1>
      <p className="text-gray-600 mt-2 text-sm md:text-base font-arial">{data.district}</p>

      {/* Sección de Imágenes - Aspecto 4:3, una debajo de la otra */}
      {hasImages && (
        <section className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 font-arial">Imágenes</h2>
          <div className="flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto">
            {data.files.imagenes.map((img: any) => {
              // Extraer el nombre del archivo sin extensión
              const fileName = img.original_name || img.object_key.split('/').pop() || '';
              const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');

              return (
                <div key={img.id} className="flex flex-col">
                  <div className="relative w-full bg-gray-200 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(img.object_key)}`}
                      alt={nameWithoutExtension}
                      className="w-full h-full object-cover hover:opacity-90 transition cursor-pointer"
                    />
                  </div>
                  <p className="text-center text-sm md:text-base text-gray-700 mt-2 font-arial">{nameWithoutExtension}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sección de Documentos */}
      {hasDocuments && (
        <section className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 font-arial">Documentos (PDF)</h2>
          <ul className="space-y-2 max-w-4xl mx-auto">
            {data.files.documentos.map((d: any) => (
              <li key={d.id}>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(d.object_key)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition text-sm md:text-base font-arial break-words"
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
        <section className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 font-arial">Videos (MP4)</h2>
          <div className="flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto">
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
        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-100 rounded-lg text-center text-gray-600 text-sm md:text-base font-arial">
          No hay archivos disponibles para esta propiedad
        </div>
      )}
    </main>
  );
}
