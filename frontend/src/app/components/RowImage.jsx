import Image from "next/image";

const RowImage = (props) => {
  const imageColLg = Number(props.imageColLg ?? 12);
  const imageColXl = Number(props.imageColXl ?? imageColLg);
  const imageColMd = Number(props.imageColMd ?? 12);
  const imageCol = Number(props.imageCol ?? 12);

  return (
    <div className="container">
      <div className="row mx-0">
        <div className={`col-lg-${imageColLg} col-xl-${imageColXl} col-md-${imageColMd} col-${imageCol}`}>
          <Image
            src={props.ImgAbout || "/placeholder-image.jpg"}
            className={`responsive-media ${props.ImgAboutClass || ""}`}
            alt={props.imgAlt?.trim() ? props.imgAlt : (props.titleHeading || "About High Creation Interior")}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            style={{ width: "100%", maxWidth: "100%" }}
          />
        </div>
        <div className={`d-flex align-items-center col-lg-${12 - imageColLg} col-md-${12 - imageColMd} col-${12 - imageCol}`}>
          <div className={props.divclass}>
            {/* 🌟 SEO FIX: Changed to h2 but kept the h3 visual size */}
            <h2 className="h3">
              {props.titleHeading}
              <span className={props.subHeadingClass}>{props.subHeading}</span>
            </h2>
            <p>{props.description}</p>
            {props.textAboutBtn ? (
              <a 
                className={props.textAboutBtnCLass} 
                href={props.btnLink}
                aria-label={`${props.textAboutBtn} - ${props.titleHeading || 'Read more'}`} 
              >
                {props.textAboutBtn}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowImage;