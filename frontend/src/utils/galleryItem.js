const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

// Server-side version of the call the gallery clients used to make in the browser:
// GET /cms-parent-child/by-id/<id>. Returns null on any problem, so the client
// component simply falls back to its own fetch.
export async function getGalleryItem(id) {
  if (!id) return null;
  try {
    const res = await fetch(
      `${getBaseUrl()}/cms-parent-child/by-id/${encodeURIComponent(id)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error(`Gallery item fetch ${id} -> ${res.status} (base: ${getBaseUrl()})`);
      return null;
    }
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch (err) {
    console.error("Gallery item fetch error:", err);
    return null;
  }
}