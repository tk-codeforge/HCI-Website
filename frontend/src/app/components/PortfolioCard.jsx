// const PortfolioCard = (props) => {
//   return (
//     <div>
//       <section className="">
//         <a href={props.cardDetailLink}>
//           <div className={props.portCard}>
//             <div
//               className={props.portfolioImgBg}
//               style={{
//                 // 🌟 CMS Fix: Merged background sizing rules to prevent stretching
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//                 ...(props?.portfolioImg ? { backgroundImage: `url(${props?.portfolioImg})` } : {})
//               }}
//             >
//               {/* <a href={props.cardDetailLink}>
//             </a> */}
//               <div>
//                 {props.portfolioTitle ? (
//                   <h4 className="text-white mb-0">{props.portfolioTitle}</h4>
//                 ) : null}
//                 <p className={props.portfolioClassCss}>
//                   {props.portfolioDescription}
//                 </p>
//                 {/* {props.firstKey ? (
//                 <p className="text-white mb-0 team_description">
//                   <span className="fw-bolder">{props.firstKey} : </span>
//                   {props.firstValue}
//                 </p>
//               ) : null}
//               {props.secondValue ? (
//               <p className="text-white mb-0 team_description">
//                   <span className="fw-bolder">{props.secondKey} : </span>
//                   {props.secondValue}
//                 </p>
//               ) : null} */}
//               </div>
//               <div className="text-end">
//                 {/* {props.textBtnCard ? (
//                 <a href="" className={textBtnCardClass}>
//                   {props.textBtnCard}
//                 </a>
//               ) : null} */}
//               </div>
//             </div>
//           </div>
//         </a>
//       </section>
//     </div>
//   );
// };

// export default PortfolioCard;

import { MediaImg } from "./MediaImage";

const PortfolioCard = (props) => {
  return (
    <div>
      <section className="">
        <a href={props.cardDetailLink}>
          <div className={props.portCard}>
            <div
              className={props.portfolioImgBg}
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                ...(props?.portfolioImg ? { backgroundImage: `url(${props?.portfolioImg})` } : {})
              }}
            >
              {props?.portfolioImg && (
                <MediaImg
                  src={props.portfolioImg}
                  fallbackAlt={props.portfolioImgAlt || props.portfolioTitle || ""}
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
                  <h4 className="text-white mb-0">{props.portfolioTitle}</h4>
                ) : null}
                <p className={props.portfolioClassCss}>
                  {props.portfolioDescription}
                </p>
              </div>
              <div className="text-end" style={{ position: "relative", zIndex: 1 }}></div>
            </div>
          </div>
        </a>
      </section>
    </div>
  );
};

export default PortfolioCard;