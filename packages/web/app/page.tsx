import Link from "next/link";
import { api } from "@/lib/api";

export default async function HomePage() {
  const properties = await api("/properties");
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-wide">INMUEBLES EN VENTA</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {properties.map((p: any) => (
          <Link key={p.id} href={`/inmuebles/${p.slug}`} className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-medium">{p.title}</h2>
            <p className="text-sm text-gray-500">{p.district}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
