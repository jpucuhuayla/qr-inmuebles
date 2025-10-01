"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QR({ url }: { url: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) QRCode.toCanvas(ref.current, url, { width: 256 });
  }, [url]);
  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={ref} />
      <button onClick={() => {
        const a = document.createElement("a");
        a.download = "qr-inmuebles.png";
        a.href = ref.current!.toDataURL("image/png");
        a.click();
      }} className="px-3 py-2 rounded-lg border">Descargar QR</button>
    </div>
  );
}
