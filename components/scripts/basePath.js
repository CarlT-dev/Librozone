// components/scripts/basePath.js
const url   = new URL(import.meta.url);
const parts = url.pathname.split("/").filter(Boolean);
// parts: ["Librozone", "components", "scripts", "basePath.js"]
// Drop the last 3 (scripts, components, basePath.js) — keeping only the repo root
parts.splice(-(3));
export const BASE = url.origin + "/" + parts.join("/") + (parts.length ? "/" : "");