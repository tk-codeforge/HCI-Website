import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

// No "use client": this component only renders an image.
// The old version fetched /cms-content/team on mount (plus axios, react-toastify
// and four hooks) but never used the result, so that request, its JS and its
// error toast are removed.

// "images/teams.jpeg" (no leading slash) is normalised so the image optimizer
// can resize it. Absolute URLs are left untouched.
const normalizeSrc = (src) =>
  src && !/^(https?:)?\/\//.test(src) && !src.startsWith("/") ? `/${src}` : src;

const TeamGallery = ({
  galleryImage,
  showFallback = true,
  // Pass the image's real pixel size (e.g. imageWidth={1600} imageHeight={900})
  // so the browser can reserve its space and the "explicit width and height"
  // audit passes. Left undefined, the markup is exactly as before.
  imageWidth,
  imageHeight,
}) => {
  const src = normalizeSrc(galleryImage);
  const optimized = src && canOptimize(src);

  return (
    <div>
      <section className="my-5">
        <div className="container">
          {(galleryImage || showFallback) && (
            <img
              src={src}
              srcSet={optimized ? optimizedSrcSet(src) : undefined}
              sizes={optimized ? "(min-width: 1200px) 1140px, 100vw" : undefined}
              width={imageWidth}
              height={imageHeight}
              className="img-thumbnail responsive-media"
              alt="Team gallery"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      </section>
      <hr />
    </div>
  );
};

export default TeamGallery;
