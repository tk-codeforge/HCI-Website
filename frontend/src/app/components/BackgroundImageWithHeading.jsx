"use client";
import { MediaImg } from "./MediaImage";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

// Smaller files for phones, the original file for wide desktop screens.
function heroSrcSet(url) {
  if (!canOptimize(url)) return undefined;
  const resized = optimizedSrcSet(url, [384, 640, 828, 1080]);
  return resized ? `${resized}, ${url} 1920w` : undefined;
}

const BackgroundImageWithHeading = (props) => {
  const HeadingTag = props.headingTag || "h1";
  const hasBgImage =
    props.bgImageUrl && typeof props.bgImageUrl === "string" && props.bgImageUrl.trim() !== "";

  const srcSet = hasBgImage ? heroSrcSet(props.bgImageUrl) : undefined;

  return (
    <div>
      <section
        className={props.sectionBgImages}
        // The <img> below paints the picture. The section's own CSS background (including
        // any default from the class) is switched off so the image is not loaded twice.
        style={
          hasBgImage
            ? { backgroundImage: "none", position: "relative" }
            : undefined
        }
      >
        {hasBgImage && (
          <MediaImg
            src={props.bgImageUrl}
            srcSet={srcSet}
            sizes={srcSet ? "100vw" : undefined}
            alt={props.bgImageAlt}
            fallbackAlt={props.sectionBgHeading || ""}
            width={1920}
            height={600}
            loading="eager"
            fetchPriority="high"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
        <div className="container" style={hasBgImage ? { position: "relative", zIndex: 1 } : undefined}>
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-12">
              <HeadingTag
                className={props.secBgHeadingClass}
                style={{
                  color: "#ffffff",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  ...(props.sectionBgHeadingStyle || {}),
                }}
              >
                {props.sectionBgHeading}
              </HeadingTag>
              <p
                className={props.secBgDesClass}
                style={{
                  fontSize: props.descriptionFontSize,
                  ...(props.sectionBgDescriptionStyle || {}),
                }}
              >
                {props.sectionBgDescription}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BackgroundImageWithHeading;
