// import { MediaImg } from "./MediaImage";

// const WallpaperCard = (props) => {
//   return (
//     <div>
//       <div className={props.wallpaperCard}>
//        <a href={props.linkTagWallpaper}>
//         <div className="">
//           {/* <img
//             src={props.imgWallpaper}
//             className={`responsive-media ${props.wallpaperImgClass || ""}`}
//             alt={props.altWallpaper}
//             loading="lazy"
//             decoding="async"
//           /> */}

//                     <MediaImg
//             src={props.imgWallpaper}
//                         alt={props.cmsAltWallpaper}
//             className={`responsive-media ${props.wallpaperImgClass || ""}`}
//             fallbackAlt={props.altWallpaper}
//           />
//         </div></a>
//         <div className="card-body px-4 pt-3">
//           {props.titleSpan ? <span className="spanttt">{props.titleSpan}</span> : null}
//           <h4 className={props.portfolioTitleClass}>{props.portfolioTitle}</h4>
//           <div className="row justify-content-center align-items-center g-2">
//             <div className="col-lg-7">
//               <p className={props.descriptionClass}>
//                 {props.wallpaperDescriptiion}
//               </p>
//             </div>
//             <div className="col-lg-5">
//               <div className="text-end">
//                 {props.textBtnWallpaper ? (
//                   <a href={props.btnHrefWallpaper} className="know_more px-3">
//                     {props.textBtnWallpaper}
//                   </a>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WallpaperCard;


import { MediaImg } from "./MediaImage";

const WallpaperCard = (props) => {
  return (
    <div>
      <div className={props.wallpaperCard}>
       <a href={props.linkTagWallpaper}>
        <div className="">
          {/* <img
            src={props.imgWallpaper}
            className={`responsive-media ${props.wallpaperImgClass || ""}`}
            alt={props.altWallpaper}
            loading="lazy"
            decoding="async"
          /> */}

                    <MediaImg
            src={props.imgWallpaper}
                        alt={props.cmsAltWallpaper}
            className={`responsive-media ${props.wallpaperImgClass || ""}`}
            fallbackAlt={props.altWallpaper}
            // Opt-in: reserve space before the lazy image loads ("auto" = use the
            // real ratio once loaded, so the final look is unchanged).
            style={props.imgAspectRatio ? { aspectRatio: `auto ${props.imgAspectRatio}` } : undefined}
          />
        </div></a>
        <div className="card-body px-4 pt-3">
          {props.titleSpan ? <span className="spanttt">{props.titleSpan}</span> : null}
          <h4 className={props.portfolioTitleClass}>{props.portfolioTitle}</h4>
          <div className="row justify-content-center align-items-center g-2">
            <div className="col-lg-7">
              <p className={props.descriptionClass}>
                {props.wallpaperDescriptiion}
              </p>
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
