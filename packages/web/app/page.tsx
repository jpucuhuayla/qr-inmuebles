import Link from "next/link";
import { api } from "@/lib/api";

export default async function HomePage() {
  const properties = await api("/properties");
  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-6 md:mb-8 font-arial">INMUEBLES EN VENTA</h1>
      <div className="space-y-4 md:space-y-6">
        {properties.map((p: any) => (
          <Link
            key={p.id}
            href={`/inmuebles/${p.slug}`}
            className="block border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Información - Lado Izquierdo - 2/3 del ancho */}
              <div className="w-full md:w-2/3 p-4 md:p-6 bg-white flex flex-col justify-between">
                <div className="space-y-3 md:space-y-4">
                  {/* Campo 1: Título */}
                  <h2 className="text-base md:text-lg font-arial font-medium text-gray-900">
                    {p.title}
                  </h2>

                  {/* Campo 2: Precio (doble de tamaño) */}
                  <div className="text-xl md:text-2xl font-arial font-bold text-gray-900">
                    {p.price_sol && `S/ ${parseFloat(p.price_sol).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    {p.price_sol && p.price_usd && " / "}
                    {p.price_usd && `$ ${parseFloat(p.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>

                  {/* Campo 3: Dirección */}
                  {p.address && (
                    <p className="text-sm md:text-base font-arial text-gray-700">
                      {p.address}
                    </p>
                  )}

                  {/* Campo 4: Descripción */}
                  <div className="text-sm md:text-base font-arial text-gray-700 space-y-1">
                    {p.description && <p>{p.description}</p>}
                    {(p.bedrooms || p.area_m2) && (
                      <p>
                        {p.bedrooms && `${p.bedrooms} dormitorio${p.bedrooms > 1 ? 's' : ''}`}
                        {p.bedrooms && p.area_m2 && " • "}
                        {p.area_m2 && `${parseFloat(p.area_m2).toFixed(2)} m²`}
                      </p>
                    )}
                  </div>

                  {/* Campo 5: Áreas comunes - separadas por guión */}
                  {p.common_areas && (
                    <p className="text-sm md:text-base font-arial text-gray-600">
                      {p.common_areas.split(',').map((area: string) => area.trim()).join(' - ')}
                    </p>
                  )}
                </div>

                {/* Campo 6: Botón verde */}
                <button className="w-full mt-3 md:mt-4 bg-green-600 hover:bg-green-700 text-white font-arial py-2 md:py-3 px-4 rounded transition-colors text-sm md:text-base">
                  Clic aquí para más información
                </button>
              </div>

              {/* Imagen - Lado Derecho - 1/3 del ancho - Aspecto 4:3 */}
              <div className="w-full md:w-1/3 relative bg-gray-200 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                {p.main_image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/files/presign-download?objectKey=${encodeURIComponent(p.main_image)}`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
