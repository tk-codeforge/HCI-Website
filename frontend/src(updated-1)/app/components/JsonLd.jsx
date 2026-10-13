export default function JsonLd({ data }) {
  if (!data) return null;
  try {
    const obj = typeof data === "string" ? JSON.parse(data) : data;
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(obj).replace(/</g, "\\u003c") }}
      />
    );
  } catch {
    return null;
  }
}