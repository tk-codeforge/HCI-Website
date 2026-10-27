import ExperienceFormClient from "./ExperienceFormClient";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
};

async function fetchFormConfig() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/experience_center_form`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    return record?.json_content || null;
  } catch (err) {
    console.error("Failed to fetch form config on server:", err);
    return null;
  }
}

export default async function ExperienceForm() {
  const formConfig = await fetchFormConfig();
  return <ExperienceFormClient initialConfig={formConfig} />;
}