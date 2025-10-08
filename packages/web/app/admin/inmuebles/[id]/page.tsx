"use client";

import { useEffect, useState } from "react";

type PropertyFile = {
  id: string;
  object_key: string;
  original_name: string | null;
  file_type: string;
};

type Property = {
  id: string;
  title: string;
  slug: string;
  district: string;
  files: {
    imagenes: PropertyFile[];
    videos: PropertyFile[];
    documentos: PropertyFile[];
  };
};

export default function EditProperty({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState(false);

  async function fetchProperty() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`);
    const data = await res.json();
    if (data.error) {
      alert("Propiedad no encontrada");
      return;
    }
    setProperty(data);
  }

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Pedir URL pre-firmada a la API
      const presignRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/presign-upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { url, key } = await presignRes.json();

      // 2. Subir el archivo directamente a S3
      await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

      // 3. Registrar el archivo en nuestra base de datos
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${params.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectKey: key, originalName: file.name, fileType: file.type }),
      });

      // 4. Refrescar la lista de archivos
      await fetchProperty();
      alert("Archivo subido exitosamente");
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      alert("Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFile(fileId: string) {
    if (!confirm("¿Seguro que deseas eliminar este archivo?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${fileId}`, {
        method: "DELETE",
      });
      await fetchProperty();
      alert("Archivo eliminado");
    } catch (error) {
      console.error("Error eliminando archivo:", error);
      alert("Error al eliminar el archivo");
    }
  }

  if (!property) return <div className="container mx-auto p-6">Cargando...</div>;

  const allFiles = [
    ...property.files.imagenes,
    ...property.files.videos,
    ...property.files.documentos,
  ];

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
      <p className="text-gray-600 mb-6">{property.district}</p>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Subir archivos</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="mb-4 border rounded p-2 w-full"
          accept="image/*,video/*,.pdf"
        />
        {uploading && <p className="text-blue-600">Subiendo archivo...</p>}
      </section>

      <section className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Archivos ({allFiles.length})</h2>

        {allFiles.length === 0 && (
          <p className="text-gray-500">No hay archivos subidos</p>
        )}

        {property.files.imagenes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Imágenes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.files.imagenes.map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(file.object_key)}`}
                    alt={file.original_name || "imagen"}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    Eliminar
                  </button>
                  <p className="text-xs mt-1 truncate">{file.original_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {property.files.documentos.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Documentos</h3>
            <ul className="space-y-2">
              {property.files.documentos.map((file) => (
                <li key={file.id} className="flex justify-between items-center border-b pb-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(file.object_key)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📄 {file.original_name || file.object_key}
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {property.files.videos.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Videos</h3>
            <ul className="space-y-2">
              {property.files.videos.map((file) => (
                <li key={file.id} className="flex justify-between items-center border-b pb-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(file.object_key)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🎥 {file.original_name || file.object_key}
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}