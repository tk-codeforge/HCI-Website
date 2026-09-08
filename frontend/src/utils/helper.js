export const getBackendImageUrl = (path) => {
    if (!path) return "";

    // Already a complete URL
    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    const API_BASE =
        process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_API_DEV_URL
            : process.env.NEXT_PUBLIC_API_BASE_URL;

    return `${API_BASE}/uploads${path}`;
};
export const defaultAltText = "High Creation Interior Image";