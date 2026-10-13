import api from "@/utils/api";

export const normalizeLeadPath = (path = "/") => {
    const rawPath = String(path || "/").split("?")[0].trim();

    if (!rawPath || rawPath === "*") {
        return "/";
    }

    let normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

    if (normalizedPath.length > 1) {
        normalizedPath = normalizedPath.replace(/\/+$/, "");
    }

    return normalizedPath || "/";
};

export const getLeadDeviceType = () => {
    if (typeof window === "undefined") {
        return "desktop";
    }

    return window.innerWidth <= 768 ? "mobile" : "desktop";
};

export const resolveLeadRule = async (path) => {
    const response = await api.get("/popup-rules/resolve", {
        params: {
            path: normalizeLeadPath(path),
        },
    });

    return response.data || null;
};

export const buildLeadMetadata = ({
    pathname,
    leadFormType = "inline",
    rule = null,
    leadFormName = "",
    triggerType = "",
    ctaText = "",
    deviceType = "",
}) => ({
    source_url: normalizeLeadPath(pathname),
    lead_form_name: leadFormName || rule?.lead_form_name || null,
    lead_form_type: leadFormType || null,
    trigger_type: triggerType || rule?.trigger_type || null,
    cta_text: ctaText || rule?.cta_text || null,
    device_type: deviceType || getLeadDeviceType(),
});


// src/utils/helper.js

// Keep your existing exports
export const imageBaseUrl = `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV_URL : process.env.NEXT_PUBLIC_API_BASE_URL}/uploads`;
export const defaultAltText = "High Creation Interior";

// ADD THIS: Helper to fetch images from your backend folders
export const getBackendImageUrl = (path) => {
    // path example: '/parent-child/wework_bgImage.94f57400.jpg'
    return `${process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV_URL : process.env.NEXT_PUBLIC_API_BASE_URL}/uploads${path}`;
};