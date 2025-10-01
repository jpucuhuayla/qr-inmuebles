import { api } from "@/lib/api";
import QR from "@/components/QR";
import Link from "next/link";

export default async function Admin() {
  const properties = await api("/properties");
  const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Inmuebles</h1>
        <Link href="/admin/inmuebles/new" className="px-3 py-2 rounded bg-black text-white">Nuevo inmueble</Link>
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {properties.map((p: any) => (
          <Link key={p.id} href={`/admin/inmuebles/${p.id}`} className="border rounded-2xl p-4 bg-white shadow-sm">
            <h2 className="text-lg font-medium">{p.title}</h2>
            <p className="text-sm text-gray-500">/{p.slug}</p>
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">QR único del portal</h2>
        <QR url={url} />
      </section>
    </main>
  );
}
