import "../styles/globals.css";
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Inmuebles en Venta',
  description: 'Plataforma de venta de inmuebles',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
