import { MediaImg } from "./MediaImage";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

const BackgroundImageRow = (props) => {
  const HeadingTag = props.headingTag || "h1";
  const hasBgImage = Boolean(props.bgImageUrl);

  // Use responsive Next.js image candidates for the banner when supported.
  // Keep the original URL as src so MediaImg can still resolve Media Library alt text.
  const optimizedImageProps =
    hasBgImage && canOptimize(props.bgImageUrl)
      ? {
          srcSet: optimizedSrcSet(props.bgImageUrl),
          sizes: props.bgImageSizes || "100vw",
        }
      : {};

  return (
    <div>
      <section
        className={props.sectionBgImages}
        style={{
          // The positioned <img> below is the visible banner. Avoid requesting the
          // same full-size asset again as a CSS background image.
          backgroundImage: hasBgImage ? "none" : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: hasBgImage ? "relative" : undefined,
        }}
      >
        {hasBgImage && (
          <MediaImg
            src={props.bgImageUrl}
            alt={props.bgImageAlt}
            fallbackAlt={props.sectionBgHeading || ""}
            width={1920}
            height={600}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            {...optimizedImageProps}
            className={props.bgImageClassName}
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

        <div
          className="container"
          style={hasBgImage ? { position: "relative", zIndex: 1 } : undefined}
        >
          <div className="row justify-content-center">
            <div className="col-12 col-lg-12">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-6">
                  <HeadingTag
                    className={`${props.secBgHeadingClass || ""} text-white`}
                    style={{ color: "#ffffff", ...props.sectionBgHeadingStyle }}
                  >
                    {props.sectionBgHeading}
                  </HeadingTag>
                </div>
                <div className="col-lg-6">
                  <p
                    className={`${props.secBgDesClass || ""} text-light`}
                    style={{
                      fontSize: props.descriptionFontSize,
                      opacity: 0.9,
                      ...props.sectionBgDescriptionStyle,
                    }}
                  >
                    {props.sectionBgDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BackgroundImageRow;
