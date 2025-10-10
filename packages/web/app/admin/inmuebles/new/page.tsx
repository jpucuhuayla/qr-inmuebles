"use client";
import { useState } from "react";

export default function NewProperty() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    type: "departamento",
    district: "",
    address: "",
    price_sol: "",
    price_usd: "",
    description: "",
    common_areas: "",
    area_m2: "",
    bedrooms: "",
    bathrooms: "",
    parking_spaces: ""
  });

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Nuevo inmueble</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título del aviso*</label>
          <input
            placeholder="Ej: Departamento Surquillo"
            value={form.title}
            onChange={e => {
              const title = e.target.value;
              // Auto-generar slug desde el título
              const slug = title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remover acentos
                .replace(/[^a-z0-9\s-]/g, "") // Solo letras, números, espacios y guiones
                .trim()
                .replace(/\s+/g, "-"); // Reemplazar espacios con guiones
              setForm({ ...form, title, slug });
            }}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (URL)*</label>
          <input
            placeholder="Ej: departamento-surquillo"
            value={form.slug}
            onChange={e => setForm({ ...form, slug: e.target.value })}
            className="border rounded w-full p-2"
          />
          <p className="text-xs text-gray-500 mt-1">Se genera automáticamente desde el título, pero puedes editarlo</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo*</label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="border rounded w-full p-2"
          >
            <option value="departamento">Departamento</option>
            <option value="estacionamiento">Estacionamiento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Distrito*</label>
          <input
            placeholder="Ej: Surquillo"
            value={form.district}
            onChange={e => setForm({ ...form, district: e.target.value })}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            placeholder="Ej: Av. Angamos Este N°1549 - Surquillo"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio en Soles (S/)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 250000.00"
              value={form.price_sol}
              onChange={e => setForm({ ...form, price_sol: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio en Dólares ($) - Opcional</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 65000.00"
              value={form.price_usd}
              onChange={e => setForm({ ...form, price_usd: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción del inmueble</label>
          <textarea
            placeholder="Ej: Amplio departamento con vista panorámica, acabados de primera..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
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
              placeholder="Ej: 85.50"
              value={form.area_m2}
              onChange={e => setForm({ ...form, area_m2: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dormitorios</label>
            <input
              type="number"
              placeholder="Ej: 3"
              value={form.bedrooms}
              onChange={e => setForm({ ...form, bedrooms: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baños</label>
            <input
              type="number"
              placeholder="Ej: 2"
              value={form.bathrooms}
              onChange={e => setForm({ ...form, bathrooms: e.target.value })}
              className="border rounded w-full p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estacionamientos</label>
          <input
            type="number"
            placeholder="Ej: 1"
            value={form.parking_spaces}
            onChange={e => setForm({ ...form, parking_spaces: e.target.value })}
            className="border rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Áreas comunes - Opcional</label>
          <textarea
            placeholder="Ej: Piscina, Gym, Salón de usos múltiples, Área de juegos..."
            value={form.common_areas}
            onChange={e => setForm({ ...form, common_areas: e.target.value })}
            className="border rounded w-full p-2"
            rows={2}
          />
        </div>

        <button
          className="w-full px-4 py-3 rounded bg-black text-white hover:bg-gray-800 transition-colors mt-4"
          onClick={async () => {
            // Validar campos requeridos
            if (!form.title.trim()) {
              alert("El título es requerido");
              return;
            }
            if (!form.slug.trim()) {
              alert("El slug es requerido");
              return;
            }
            if (!form.district.trim()) {
              alert("El distrito es requerido");
              return;
            }

            // Convertir valores numéricos
            const data: any = {
              title: form.title,
              slug: form.slug,
              type: form.type,
              district: form.district,
              address: form.address || undefined,
              price_sol: form.price_sol ? parseFloat(form.price_sol) : undefined,
              price_usd: form.price_usd ? parseFloat(form.price_usd) : undefined,
              description: form.description || undefined,
              common_areas: form.common_areas || undefined,
              area_m2: form.area_m2 ? parseFloat(form.area_m2) : undefined,
              bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
              bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
              parking_spaces: form.parking_spaces ? parseInt(form.parking_spaces) : undefined
            };

            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
              });

              if (!res.ok) {
                throw new Error("Error al crear el inmueble");
              }

              location.href = "/admin";
            } catch (error) {
              alert("Error al crear el inmueble");
              console.error(error);
            }
          }}
        >
          Crear Inmueble
        </button>
      </div>
    </main>
  );
}
