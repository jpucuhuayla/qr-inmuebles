"use client";

import { useEffect, useState } from "react";

type Property = {
  id: number;
  title: string;
  files: { id: number; name: string; type: string }[];
};

export default function EditProperty({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);

  async function fetchProperty() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`);
    const data = await res.json();
    setProperty(data);
  }

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
      body: JSON.stringify({ fileKey: key, fileName: file.name, fileType: file.type }),
    });

    // 4. Refrescar la lista de archivos
    fetchProperty();
  }

  if (!property) return <div>Cargando...</div>;

  return (
    <main className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Editando: {property.title}</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Archivos</h2>
      <input type="file" onChange={handleFileUpload} className="mb-4" />

      <ul className="list-disc list-inside">
        {property.files.map((file) => (
          <li key={file.id}>{file.name} ({file.type})</li>
        ))}
      </ul>
    </main>
  );
}