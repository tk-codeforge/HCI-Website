import { MediaImg } from "./MediaImage";
import { optimizedSrcSet } from "@/utils/optimizedImage";

const getImageUrl = (style) => {
  const match = style?.backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
  const src = match?.[1];
  return src && src !== "undefined" && src !== "null" ? src : "";
};

const BgImageCard = ({
  cardLinkTag,
  designerCardBgDiv,
  style,
  titleBgImage,
  imageAlt,
  descriptionBg,
  ratingBg,
  buttonShareBg,
  buttonCommentBg,
  priority = false,
}) => {
  const imageSrc = getImageUrl(style);
  const { backgroundImage: _bg, ...styleWithoutBg } = style || {};
  const divStyle = imageSrc ? styleWithoutBg : style;

  const srcSet = imageSrc ? optimizedSrcSet(imageSrc, [640, 750, 828, 1080], 75) : undefined;

  return (
    <a href={cardLinkTag}>
      <div
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          ...divStyle,
        }}
        className={designerCardBgDiv}
      >
        {imageSrc && (
          <MediaImg
            src={imageSrc}
            srcSet={srcSet}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={imageAlt}
            fallbackAlt={titleBgImage || ""}
            width={1200}
            height={800}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        )}

        <div style={{ position: "relative" }}>
          <h5 className="text-light-force">{titleBgImage}</h5>
          <p className="text-white mb-0">{descriptionBg}</p>
        </div>

        <div style={{ position: "relative" }}>
          <p className="mb-0 text-white">{ratingBg}</p>
          <div className="d-flex">
            <span className="pe-3">{buttonShareBg}</span>
            <span>{buttonCommentBg}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BgImageCard;
