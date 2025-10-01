"use client";
import { useState } from "react";

export default function NewProperty() {
  const [form, setForm] = useState({ title: "", slug: "", type: "departamento", district: "" });
  return (
    <main className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Nuevo inmueble</h1>
      {(["title","slug","district"] as const).map(k=> (
        <input key={k} placeholder={k} value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="border rounded w-full p-2 mb-2" />
      ))}
      <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="border rounded w-full p-2 mb-4">
        <option value="departamento">departamento</option>
        <option value="estacionamiento">estacionamiento</option>
      </select>
      <button className="px-4 py-2 rounded bg-black text-white" onClick={async()=>{
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        location.href = "/admin";
      }}>Crear</button>
    </main>
  );
}
