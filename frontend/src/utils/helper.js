export const getBackendImageUrl = (path) => {
    if (!path) return "";

    // Already a complete URL
    // if (
    //     path.startsWith("http://") ||
    //     path.startsWith("https://")
    // ) {
    //     return path;
    // }

        // Already a complete URL: upgrade http to https (except localhost for dev)
    if (/^https?:\/\//i.test(path)) {
        if (/^http:\/\/(localhost|127\.0\.0\.1)/i.test(path)) return path;
        return path.replace(/^http:\/\//i, "https://");
    }

    // const API_BASE =
    //     process.env.NODE_ENV === "development"
    //         ? process.env.NEXT_PUBLIC_API_DEV_URL
    //         : process.env.NEXT_PUBLIC_API_BASE_URL;

        const API_BASE = (
        (process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_API_DEV_URL
            : process.env.NEXT_PUBLIC_API_BASE_URL) || "https://apidev.hcinterior.in"
    )
        .replace(/^http:\/\/(?!localhost|127\.0\.0\.1)/i, "https://")
        .replace(/\/+$/, "");

    return `${API_BASE}/uploads${path}`;
};
export const defaultAltText = "High Creation Interior Image";