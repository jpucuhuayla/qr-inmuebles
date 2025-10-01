"use client";
import { useState } from "react";

export default function Uploader({ property, tipo }: { property: any; tipo: "Documentos"|"Imagenes"|"Videos" }) {
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const ct = f.type;
        const body = { objectKey: `${property.title.replace(/\s+/g,"_")}/${tipo}/${f.name.replace(/\s+/g,"_")}`, contentType: ct };
        const pre = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/presign-upload`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r=>r.json());
        await fetch(pre.url, { method: "PUT", body: f, headers: { "Content-Type": ct } });
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${property.id}/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ file_type: tipo === "Documentos"?"documento": tipo === "Imagenes"?"imagen":"video", object_key: body.objectKey, original_name: f.name, size_bytes: f.size }) });
      }
      alert("Subido");
      location.reload();
    } finally { setBusy(false); }
  }

  return (
    <div className="border rounded-2xl p-4">
      <p className="mb-2 font-medium">Subir {tipo}</p>
      <input type="file" multiple onChange={e=>upload(e.target.files)} disabled={busy} />
    </div>
  );
}
