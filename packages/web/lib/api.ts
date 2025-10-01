export const API = process.env.NEXT_PUBLIC_API_URL!;
export async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
