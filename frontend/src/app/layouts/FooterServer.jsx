import Footer from "./footer";

const API = (
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL
)?.replace(/\/$/, ""); // same base URL logic as "@/utils/api" 

async function getJson(path) {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 30 } }); // refresh every 5 min
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// same parsing logic you already had in the client
function parseCms(res, fallback) {
  const record = Array.isArray(res) ? res[0] : res;
  let parsed = record?.json_content;
  if (parsed && typeof parsed === "object" && typeof parsed.json_content === "string") {
    try { parsed = JSON.parse(parsed.json_content); } catch { parsed = fallback; }
  } else if (typeof parsed === "string") {
    try { parsed = JSON.parse(parsed); } catch { parsed = fallback; }
  }
  return parsed ?? fallback;
}

const priorityOrder = ["Noida","Ghaziabad","Greater Noida","Delhi","Dwarka","Faridabad","Gurugram","Manesar"];
const rank = (t) => {
  const i = priorityOrder.findIndex((c) => t.toLowerCase().includes(c.toLowerCase()));
  return i === -1 ? 999 : i;
};

export default async function FooterServer() {
  const [profilesRes, rulesRes, linksRes, settingsRes] = await Promise.all([
    getJson("/cms-content/footer_profiles"),
    getJson("/cms-content/footer_page_rules"),
    getJson("/footer-link"),
    getJson("/site-settings"),
  ]);

  const initialProfiles = parseCms(profilesRes, {});
  const rules = parseCms(rulesRes, []);
  const initialRules = Array.isArray(rules) ? rules : [];

  const initialLinks = Array.isArray(linksRes)
    ? [...linksRes].sort((a, b) => rank(a.title) - rank(b.title))
    : [];

  const rawSettings = settingsRes?.data || settingsRes;
  const initialSettings = (Array.isArray(rawSettings) ? rawSettings[0] : rawSettings) || {};

  return (
    <Footer
      initialProfiles={initialProfiles}
      initialRules={initialRules}
      initialLinks={initialLinks}
      initialSettings={initialSettings}
    />
  );
}