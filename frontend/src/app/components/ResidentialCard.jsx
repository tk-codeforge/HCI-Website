import ProjectCardImage from "./ProjectCardImage";

const DEFAULT_IMAGE_SIZES =
  "(max-width: 767px) calc(100vw - 24px), (max-width: 991px) calc(50vw - 24px), 33vw";

const ResidentialCard = (props) => {
  const imgAlt =
    props.resolvedImageAlt ||
    props.cmsAltResi ||
    props.resiImgAlt ||
    props.resiImgALt ||
    props.residentialTitle ||
    "Residential Project";

  return (
    <div className="h-100">
      <a
        href={props.projectCardLink}
        className="text-decoration-none"
        aria-label={props.residentialTitle ? `Explore ${props.residentialTitle}` : "Explore residential project"}
      >
        <div
          className={`${props.cardNameResid || ""} residential-project-card card h-100 border-0 shadow-sm rounded-4 overflow-hidden`}
          style={{ marginBottom: 0 }}
        >
          <div
            className="position-relative overflow-hidden bg-light"
            style={{ aspectRatio: "4 / 3" }}
          >
            <ProjectCardImage
              src={props.resiImgUrl}
              alt={imgAlt}
              width={800}
              height={600}
              sizes={props.imageSizes || DEFAULT_IMAGE_SIZES}
              decoding="async"
              className={`residential-project-card-image w-100 h-100 ${props.resiImgClass || ""}`}
              style={{ objectFit: "cover" }}
              loading={props.imageLoading || "lazy"}
              fetchPriority={props.imageFetchPriority}
            />
          </div>

          <div className="card-body d-flex flex-column px-4 pt-3 pb-3 bg-white">
            <h5 className={`${props.residentialTitleClass || ""} fw-bold text-dark mb-2`}>
              {props.residentialTitle}
            </h5>

            {props.residentialDescriptiion && (
              <div
                className={`${props.residentialClassCss || ""} text-muted mb-2`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  textOverflow: "ellipsis",
                }}
                dangerouslySetInnerHTML={{ __html: props.residentialDescriptiion }}
              />
            )}

            <div className="mt-auto pt-2 d-flex">
              <span className="know_more rounded-pill px-4 py-2 fw-semibold d-inline-block">
                {props.residentialButton || "Explore Design"} <span className="ms-1" aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ResidentialCard;
