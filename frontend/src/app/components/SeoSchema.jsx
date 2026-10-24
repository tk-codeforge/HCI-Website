const FALLBACK_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hcinterior.in/#organization",
  "name": "High Creation Interior",
  "url": "https://hcinterior.in",
  "logo": "https://hcinterior.in/images/new_hc_logo.png",
  "sameAs": [
    "https://www.instagram.com/highcreationinterior/",
    "https://www.linkedin.com/company/high-creation-interior-projects-private-limited/",
    "https://www.facebook.com/HighCreationInteriorProjectsPvtLtd/",
    "https://www.youtube.com/@HIGHCREATIONINTERIOR/",
    "https://in.pinterest.com/highcreation41/"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "1800-1200-532",
      "contactType": "customer service",
      "email": "info@hcinterior.in",
      "contactOption": "TollFree",
      "areaServed": "IN",
      "availableLanguage": "en"
    }
  ]
};

/**
 * Accept a JSON-LD object or a JSON string from the CMS.
 * Invalid or empty schema data returns null.
 */
function parseCmsSchema(rawSchema) {
  if (!rawSchema) {
    return null;
  }

  if (typeof rawSchema === "object") {
    return isSchemaObject(rawSchema) ? rawSchema : null;
  }

  if (typeof rawSchema !== "string") {
    return null;
  }

  let schemaText = rawSchema.trim();

  if (!schemaText) {
    return null;
  }

  // Support CMS fields containing a single JSON-LD script wrapper.
  schemaText = schemaText
    .replace(/^<script\b[^>]*>/i, "")
    .replace(/<\/script>\s*$/i, "")
    .trim();

  try {
    const parsedSchema = JSON.parse(schemaText);

    return isSchemaObject(parsedSchema)
      ? parsedSchema
      : null;
  } catch (error) {
    console.error("Invalid CMS JSON-LD schema:", error.message);
    return null;
  }
}

function isSchemaObject(schema) {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  if (Array.isArray(schema)) {
    return (
      schema.length > 0 &&
      schema.every(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          Boolean(item["@type"] || item["@graph"])
      )
    );
  }

  return Boolean(schema["@type"] || schema["@graph"]);
}

export default function SeoSchema({ cmsSchema }) {
  const parsedCmsSchema = parseCmsSchema(cmsSchema);

  // Use the CMS schema when valid; otherwise, use the fallback.
  const schema =
    parsedCmsSchema ?? FALLBACK_ORGANIZATION_SCHEMA;

  return (
    <script
      id="page-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c")
      }}
    />
  );
}