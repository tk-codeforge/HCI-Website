const BackgroundImageWithHeading = (props) => {
  const HeadingTag = props.headingTag || "h1";
  return (
    <div>
      <section className={props.sectionBgImages} style={
  props.bgImageUrl && typeof props.bgImageUrl === "string" && props.bgImageUrl.trim() !== ""
    ? { backgroundImage: `url(${props.bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : undefined
} >
        <div className="container">
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
              {/* <p className={props.secBgDesClass}>
                {props.sectionBgDescription}
              </p> */}
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

