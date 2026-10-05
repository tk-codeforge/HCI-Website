import api from "@/utils/api";

// ?id=103 if present, otherwise resolve the id from the slug in the URL
export const getGalleryId = async () => {
  if (typeof window === "undefined") return null;
  const fromQuery = new URLSearchParams(window.location.search).get("id");
  if (fromQuery) return fromQuery;
  try {
    const res = await api.get("/slug-edit/resolve", { params: { path: window.location.pathname } });
    return res.data?.entityId != null ? String(res.data.entityId) : null;
  } catch {
    return null;
  }
};