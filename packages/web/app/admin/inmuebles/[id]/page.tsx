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
  address?: string;
  price_sol?: string;
  price_usd?: string;
  description?: string;
  common_areas?: string;
  area_m2?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  main_image_key?: string;
  files: {
    imagenes: PropertyFile[];
    videos: PropertyFile[];
    documentos: PropertyFile[];
  };
};

export default function EditProperty({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);

  async function fetchProperty() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`);
    const data = await res.json();
    if (data.error) {
      alert("Propiedad no encontrada");
      return;
    }
    setProperty(data);
    setEditForm({
      title: data.title || "",
      address: data.address || "",
      price_sol: data.price_sol || "",
      price_usd: data.price_usd || "",
      description: data.description || "",
      common_areas: data.common_areas || "",
      area_m2: data.area_m2 || "",
      bedrooms: data.bedrooms || "",
      bathrooms: data.bathrooms || "",
      parking_spaces: data.parking_spaces || "",
    });
  }

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  async function handleUpdate() {
    try {
      const data: any = {
        title: editForm.title,
        address: editForm.address || undefined,
        price_sol: editForm.price_sol ? parseFloat(editForm.price_sol) : undefined,
        price_usd: editForm.price_usd ? parseFloat(editForm.price_usd) : undefined,
        description: editForm.description || undefined,
        common_areas: editForm.common_areas || undefined,
        area_m2: editForm.area_m2 ? parseFloat(editForm.area_m2) : undefined,
        bedrooms: editForm.bedrooms ? parseInt(editForm.bedrooms) : undefined,
        bathrooms: editForm.bathrooms ? parseInt(editForm.bathrooms) : undefined,
        parking_spaces: editForm.parking_spaces ? parseInt(editForm.parking_spaces) : undefined,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar");
      }

      await fetchProperty();
      setEditing(false);
      alert("Inmueble actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando:", error);
      alert("Error al actualizar el inmueble");
    }
  }

  async function handleSetMainImage(objectKey: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ main_image_key: objectKey }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar imagen principal");
      }

      await fetchProperty();
      alert("Imagen principal actualizada");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al establecer imagen principal");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const fileArray = Array.from(files);
      let successCount = 0;
      let errorCount = 0;

      console.log(`Subiendo ${fileArray.length} archivo(s)...`);

      for (const file of fileArray) {
        try {
          console.log(`1. Pidiendo URL pre-firmada para: ${file.name}`);
          // 1. Pedir URL pre-firmada a la API
          const presignRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/presign-upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, fileType: file.type }),
          });

          if (!presignRes.ok) {
            const errorText = await presignRes.text();
            throw new Error(`Error en presign: ${errorText}`);
          }

          const { url, key } = await presignRes.json();
          console.log(`2. Subiendo a S3: ${file.name}...`);

          // 2. Subir el archivo directamente a S3
          const uploadRes = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

          if (!uploadRes.ok) {
            throw new Error(`Error subiendo a S3: ${uploadRes.status}`);
          }

          console.log(`3. Registrando en BD: ${file.name}...`);

          // 3. Registrar el archivo en nuestra base de datos
          const registerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${params.id}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              objectKey: key,
              originalName: file.name,
              fileType: file.type,
              sizeBytes: file.size
            }),
          });

          if (!registerRes.ok) {
            const errorText = await registerRes.text();
            console.error("Error del servidor:", errorText);
            throw new Error(`Error registrando archivo: ${errorText}`);
          }

          console.log(`✓ ${file.name} subido correctamente`);
          successCount++;
        } catch (error) {
          console.error(`✗ Error con ${file.name}:`, error);
          errorCount++;
        }
      }

      // 4. Refrescar la lista de archivos
      await fetchProperty();

      // Resetear el input para permitir seleccionar los mismos archivos de nuevo
      e.target.value = '';

      if (errorCount === 0) {
        alert(`✓ ${successCount} archivo(s) subido(s) exitosamente`);
      } else {
        alert(`Subida completada: ${successCount} exitoso(s), ${errorCount} con error(es)`);
      }
    } catch (error) {
      console.error("Error subiendo archivos:", error);
      alert(`Error al subir archivos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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

  async function handleDeleteProperty() {
    if (!confirm("¿Estás seguro que deseas eliminar este inmueble? Esta acción no se puede deshacer.")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar el inmueble");
      }

      alert("Inmueble eliminado correctamente");
      location.href = "/admin";
    } catch (error) {
      console.error("Error eliminando inmueble:", error);
      alert("Error al eliminar el inmueble");
    }
  }

  if (!property || !editForm) return <div className="container mx-auto p-6">Cargando...</div>;

  const allFiles = [
    ...property.files.imagenes,
    ...property.files.videos,
    ...property.files.documentos,
  ];

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2">{property.title}</h1>
          <p className="text-gray-600">{property.district}</p>
        </div>
        <button
          onClick={handleDeleteProperty}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar Inmueble
        </button>
      </div>

      {/* Sección de Edición de Información */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Información del Inmueble</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editing ? "Cancelar" : "Editar"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título del aviso</label>
              <input
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="border rounded w-full p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dirección</label>
              <input
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                className="border rounded w-full p-2"
                placeholder="Ej: Av. Angamos Este N°1549 - Surquillo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Precio en Soles (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price_sol}
                  onChange={e => setEditForm({ ...editForm, price_sol: e.target.value })}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio en Dólares ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price_usd}
                  onChange={e => setEditForm({ ...editForm, price_usd: e.target.value })}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción del inmueble</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="border rounded w-full p-2"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Área (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.area_m2}
                  onChange={e => setEditForm({ ...editForm, area_m2: e.target.value })}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dormitorios</label>
                <input
                  type="number"
                  value={editForm.bedrooms}
                  onChange={e => setEditForm({ ...editForm, bedrooms: e.target.value })}
                  className="border rounded w-full p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Baños</label>
                <input
                  type="number"
                  value={editForm.bathrooms}
                  onChange={e => setEditForm({ ...editForm, bathrooms: e.target.value })}
                  className="border rounded w-full p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estacionamientos</label>
              <input
                type="number"
                value={editForm.parking_spaces}
                onChange={e => setEditForm({ ...editForm, parking_spaces: e.target.value })}
                className="border rounded w-full p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Áreas comunes</label>
              <textarea
                value={editForm.common_areas}
                onChange={e => setEditForm({ ...editForm, common_areas: e.target.value })}
                className="border rounded w-full p-2"
                rows={2}
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar Cambios
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-gray-700">
            <p><strong>Dirección:</strong> {property.address || "No especificada"}</p>
            <p><strong>Precio:</strong> {property.price_sol && `S/ ${parseFloat(property.price_sol).toLocaleString()}`}{property.price_sol && property.price_usd && " / "}{property.price_usd && `$ ${parseFloat(property.price_usd).toLocaleString()}`}</p>
            <p><strong>Descripción:</strong> {property.description || "No especificada"}</p>
            <p><strong>Área:</strong> {property.area_m2 ? `${property.area_m2} m²` : "No especificada"}</p>
            <p><strong>Dormitorios:</strong> {property.bedrooms || "No especificado"}</p>
            <p><strong>Baños:</strong> {property.bathrooms || "No especificado"}</p>
            <p><strong>Estacionamientos:</strong> {property.parking_spaces || "No especificado"}</p>
            <p><strong>Áreas comunes:</strong> {property.common_areas || "No especificadas"}</p>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Subir archivos</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
          className="mb-4 border rounded p-2 w-full"
          accept="image/*,video/*,.pdf"
          multiple
        />
        {uploading && <p className="text-blue-600">Subiendo archivo(s)...</p>}
        <p className="text-sm text-gray-500">Puedes seleccionar múltiples archivos a la vez</p>
      </section>

      <section className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Archivos ({allFiles.length})</h2>

        {allFiles.length === 0 && (
          <p className="text-gray-500">No hay archivos subidos</p>
        )}

        {property.files.imagenes.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Imágenes</h3>
            <p className="text-sm text-gray-600 mb-3">Haz clic en "Imagen principal" para seleccionar la imagen que se mostrará en el listado</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.files.imagenes.map((file) => (
                <div key={file.id} className="relative group">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(file.object_key)}`}
                    alt={file.original_name || "imagen"}
                    className={`w-full h-32 object-cover rounded ${property.main_image_key === file.object_key ? 'ring-4 ring-green-500' : ''}`}
                  />
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    {property.main_image_key !== file.object_key && (
                      <button
                        onClick={() => handleSetMainImage(file.object_key)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Imagen principal
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-xs mt-1 truncate">
                    {file.original_name}
                    {property.main_image_key === file.object_key && <span className="text-green-600 font-semibold"> ★ Principal</span>}
                  </p>
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