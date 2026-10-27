import { MediaImg } from "./MediaImage";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

const PortfolioCard = (props) => {
  const TitleTag = props.portfolioTitleTag || "h4";
  const hasImage = Boolean(props.portfolioImg);
  const isPriority = props.portfolioImgPriority === true;

  // Ask the browser for a rendition sized for this card instead of downloading
  // the original full-resolution image. The original src is retained for the
  // Media Library alt-text lookup and as a fallback for unsupported URLs.
  const optimizedImageProps =
    hasImage && canOptimize(props.portfolioImg)
      ? {
          srcSet: optimizedSrcSet(props.portfolioImg),
          sizes:
            props.portfolioImgSizes ||
            "(min-width: 1200px) 570px, (min-width: 992px) 50vw, 100vw",
        }
      : {};

  return (
    <div>
      <section className="">
        <a
          href={props.cardDetailLink}
          aria-label={props.portfolioTitle ? undefined : "View details"}
        >
          <div className={props.portCard}>
            <div
              className={props.portfolioImgBg}
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                // The positioned image below provides the visible card image.
                // Suppress a second CSS background request for the same asset.
                ...(hasImage ? { backgroundImage: "none" } : {}),
              }}
            >
              {hasImage && (
                <MediaImg
                  src={props.portfolioImg}
                  alt={props.portfolioImgAlt}
                  fallbackAlt={props.portfolioTitle || ""}
                  width={1200}
                  height={800}
                  loading={isPriority ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={isPriority ? "high" : undefined}
                  {...optimizedImageProps}
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

              <div style={{ position: "relative", zIndex: 1 }}>
                {props.portfolioTitle ? (
                  <TitleTag className="text-white mb-0">
                    {props.portfolioTitle}
                  </TitleTag>
                ) : null}
                <p className={props.portfolioClassCss}>
                  {props.portfolioDescription}
                </p>
              </div>
            </div>
          </div>
        </a>
      </section>
    </div>
  );
};

export default PortfolioCard;
