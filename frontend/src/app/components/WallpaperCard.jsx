// // import { MediaImg } from "./MediaImage";

// // const WallpaperCard = (props) => {
// //   return (
// //     <div>
// //       <div className={props.wallpaperCard}>
// //        <a href={props.linkTagWallpaper}>
// //         <div className="">
// //           {/* <img
// //             src={props.imgWallpaper}
// //             className={`responsive-media ${props.wallpaperImgClass || ""}`}
// //             alt={props.altWallpaper}
// //             loading="lazy"
// //             decoding="async"
// //           /> */}

// //                     <MediaImg
// //             src={props.imgWallpaper}
// //                         alt={props.cmsAltWallpaper}
// //             className={`responsive-media ${props.wallpaperImgClass || ""}`}
// //             fallbackAlt={props.altWallpaper}
// //           />
// //         </div></a>
// //         <div className="card-body px-4 pt-3">
// //           {props.titleSpan ? <span className="spanttt">{props.titleSpan}</span> : null}
// //           <h4 className={props.portfolioTitleClass}>{props.portfolioTitle}</h4>
// //           <div className="row justify-content-center align-items-center g-2">
// //             <div className="col-lg-7">
// //               <p className={props.descriptionClass}>
// //                 {props.wallpaperDescriptiion}
// //               </p>
// //             </div>
// //             <div className="col-lg-5">
// //               <div className="text-end">
// //                 {props.textBtnWallpaper ? (
// //                   <a href={props.btnHrefWallpaper} className="know_more px-3">
// //                     {props.textBtnWallpaper}
// //                   </a>
// //                 ) : null}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default WallpaperCard;


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
//             // Opt-in: reserve space before the lazy image loads ("auto" = use the
//             // real ratio once loaded, so the final look is unchanged).
//             style={props.imgAspectRatio ? { aspectRatio: `auto ${props.imgAspectRatio}` } : undefined}
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


// import { MediaImg } from "./MediaImage";
// import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

// const WallpaperCard = (props) => {
//   // Opt-in (optimizeImage): hand the browser a resized WebP/AVIF srcSet from /_next/image
//   // instead of the full CMS original. `src` itself is left untouched, so anything
//   // MediaImg does with the original URL (e.g. its alt lookup) behaves exactly as before.
//   const optimizedProps =
//     props.optimizeImage && canOptimize(props.imgWallpaper)
//       ? {
//           srcSet: optimizedSrcSet(props.imgWallpaper),
//           sizes:
//             props.imgSizes ||
//             "(min-width: 1400px) 650px, (min-width: 768px) 50vw, 100vw",
//         }
//       : {};

//   // Opt-in (imgPriority): the above-the-fold card image is the LCP, so don't lazy-load it.
//   const priorityProps = props.imgPriority
//     ? { loading: "eager", fetchPriority: "high" }
//     : {};

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
//             // Opt-in: reserve space before the lazy image loads ("auto" = use the
//             // real ratio once loaded, so the final look is unchanged).
//             style={props.imgAspectRatio ? { aspectRatio: `auto ${props.imgAspectRatio}` } : undefined}
//             {...optimizedProps}
//             {...priorityProps}
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
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

const WallpaperCard = (props) => {
  // Opt-in (optimizeImage): hand the browser a resized WebP/AVIF srcSet from /_next/image
  // instead of the full CMS original. `src` itself is left untouched, so anything
  // MediaImg does with the original URL (e.g. its alt lookup) behaves exactly as before.
  const optimizedProps =
    props.optimizeImage && canOptimize(props.imgWallpaper)
      ? {
          srcSet: optimizedSrcSet(props.imgWallpaper),
          sizes:
            props.imgSizes ||
            "(min-width: 1400px) 650px, (min-width: 768px) 50vw, 100vw",
        }
      : {};

  // Opt-in (imgPriority): the above-the-fold card image is the LCP, so don't lazy-load it.
  const priorityProps = props.imgPriority
    ? { loading: "eager", fetchPriority: "high" }
    : {};

  // Width/height attributes (same for every card, derived from imgAspectRatio, default 1.72).
  // They only tell the browser the image's proportions; CSS still controls the displayed size.
  const aspect = Number(props.imgAspectRatio) || 1.72;
  const attrWidth = 1200;
  const attrHeight = Math.round(attrWidth / aspect);

  return (
    <div>
      <div className={props.wallpaperCard}>
       <a href={props.linkTagWallpaper}>
        <div className="">
          <MediaImg
            src={props.imgWallpaper}
            alt={props.cmsAltWallpaper}
            className={`responsive-media ${props.wallpaperImgClass || ""}`}
            fallbackAlt={props.altWallpaper}
            width={attrWidth}
            height={attrHeight}
            // Opt-in: reserve space before the lazy image loads ("auto" = use the
            // real ratio once loaded, so the final look is unchanged).
            style={props.imgAspectRatio ? { aspectRatio: `auto ${props.imgAspectRatio}` } : undefined}
            {...optimizedProps}
            {...priorityProps}
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
