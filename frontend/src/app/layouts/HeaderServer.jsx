import Header from "./Header";

const API = (
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL
)?.replace(/\/$/, ""); // same base URL logic as "@/utils/api"

async function getMenu() {
  try {
    const res = await fetch(`${API}/cms-content/navbar_header_menu`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    const items = record?.json_content?.menu;
    return Array.isArray(items) && items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

export default async function HeaderServer() {
  const initialMenu = await getMenu(); // null → Header falls back to DEFAULT_MENU
  return <Header initialMenu={initialMenu} />;
}