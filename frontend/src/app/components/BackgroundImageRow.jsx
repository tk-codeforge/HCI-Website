// const BackgroundImageRow = (props) => {
//   const HeadingTag = props.headingTag || "h1";
//   return (
//     <div>
//       <section className={props.sectionBgImages} style={{ 
//           backgroundImage: props.bgImageUrl ? `url(${props.bgImageUrl})` : undefined,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         }}>
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-12 col-lg-12">
//               <div className="row justify-content-center align-items-center">
//                 <div className="col-lg-6">
//                   {/* Added text-white class and inline style to override any global dark heading rules */}
//                   <HeadingTag 
//                     className={`${props.secBgHeadingClass || ''} text-white`} 
//                     style={{ color: '#ffffff', ...props.sectionBgHeadingStyle }}
//                   >
//                     {props.sectionBgHeading}
//                   </HeadingTag>
//                 </div>
//                 <div className="col-lg-6">
//                   {/* Added a text-light class to ensure the description is also readable on dark backgrounds */}
//                   <p 
//                     className={`${props.secBgDesClass || ''} text-light`}
//                     style={{fontSize: props.descriptionFontSize, opacity: 0.9, ...props.sectionBgDescriptionStyle }}
//                   >
//                     {props.sectionBgDescription}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BackgroundImageRow;

import { MediaImg } from "./MediaImage";

const BackgroundImageRow = (props) => {
  const HeadingTag = props.headingTag || "h1";
  const hasBgImage = Boolean(props.bgImageUrl);

  return (
    <div>
      <section className={props.sectionBgImages} style={{
          backgroundImage: hasBgImage ? `url(${props.bgImageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: hasBgImage ? 'relative' : undefined,
        }}>
        {hasBgImage && (
          <MediaImg
            src={props.bgImageUrl}
            fallbackAlt={props.bgImageAlt || props.sectionBgHeading || ""}
            loading="eager"
            className={props.bgImageClassName}
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
          <div className="row justify-content-center">
            <div className="col-12 col-lg-12">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-6">
                  <HeadingTag
                    className={`${props.secBgHeadingClass || ''} text-white`}
                    style={{ color: '#ffffff', ...props.sectionBgHeadingStyle }}
                  >
                    {props.sectionBgHeading}
                  </HeadingTag>
                </div>
                <div className="col-lg-6">
                  <p
                    className={`${props.secBgDesClass || ''} text-light`}
                    style={{fontSize: props.descriptionFontSize, opacity: 0.9, ...props.sectionBgDescriptionStyle }}
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
