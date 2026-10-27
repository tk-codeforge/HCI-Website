import { MediaImg } from "./MediaImage";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

const WallpaperCard = (props) => {
  const optimizedProps =
    props.optimizeImage && canOptimize(props.imgWallpaper)
      ? {
          srcSet: optimizedSrcSet(props.imgWallpaper),
          sizes:
            props.imgSizes ||
            "(min-width: 1400px) 650px, (min-width: 768px) 50vw, 100vw",
        }
      : {};

  // Only the first visible card without a hero banner is promoted to high priority.
  const priorityProps = props.imgPriority
    ? { loading: "eager", fetchPriority: "high" }
    : props.imgLazy
      ? { loading: "lazy", decoding: "async" }
      : {};

  const aspect = Number(props.imgAspectRatio) || 1.72;
  const attrWidth = 1200;
  const attrHeight = Math.round(attrWidth / aspect);

  return (
    <div>
      <div className={props.wallpaperCard}>
        <a href={props.linkTagWallpaper}>
          <div>
            <MediaImg
              src={props.imgWallpaper}
              alt={props.cmsAltWallpaper}
              className={`responsive-media ${props.wallpaperImgClass || ""}`}
              fallbackAlt={props.altWallpaper}
              width={attrWidth}
              height={attrHeight}
              // Preserve the current image ratio and reserve space before loading.
              style={
                props.imgAspectRatio
                  ? { aspectRatio: `auto ${props.imgAspectRatio}` }
                  : undefined
              }
              {...optimizedProps}
              {...priorityProps}
            />
          </div>
        </a>
        <div className="card-body px-4 pt-3">
          {props.titleSpan ? <span className="spanttt">{props.titleSpan}</span> : null}
          <h4 className={props.portfolioTitleClass}>{props.portfolioTitle}</h4>
          <div className="row justify-content-center align-items-center g-2">
            <div className="col-lg-7">
              <p className={props.descriptionClass}>{props.wallpaperDescriptiion}</p>
            </div>
            <div className="col-lg-5">
              <div className="text-end">
                {props.textBtnWallpaper ? (
                  <a href={props.btnHrefWallpaper} className="know_more px-3">
                    {props.textBtnWallpaper}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallpaperCard;
