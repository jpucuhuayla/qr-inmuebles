"use client";
import { useState } from "react";

export default function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  return (
    <main className="container mx-auto p-6 max-w-sm">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <input value={u} onChange={e=>setU(e.target.value)} placeholder="Usuario" className="border rounded w-full p-2 mb-2" />
      <input value={p} onChange={e=>setP(e.target.value)} placeholder="Contraseña" type="password" className="border rounded w-full p-2 mb-4" />
      <button className="px-4 py-2 rounded bg-black text-white" onClick={async()=>{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: u, password: p }) });
        if (res.ok) {
          const j = await res.json();
          localStorage.setItem("token", j.token);
          location.href = "/admin";
        } else alert("Error");
      }}>Entrar</button>
    </main>
  );
}
