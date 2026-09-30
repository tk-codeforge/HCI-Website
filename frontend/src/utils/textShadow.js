// Same formula the admin preview uses, so admin and public page always match
export const buildTextShadow = (enabled, intensity) => {
  const i = Number(intensity) || 4;
  return enabled ? `0 ${Math.ceil(i / 2)}px ${i}px rgba(0,0,0,0.6)` : "none";
};

export const BANNER_ASPECT_RATIO = "1900 / 441";