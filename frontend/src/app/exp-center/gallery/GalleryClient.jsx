// "use client";
// import GalleryDetail from "../../components/GalleryDetail";
// import MainLayout from "../../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";

// export default function GalleryClient({ galleryData }) {
//   // Filter out any empty rows just in case some child slots aren't filled yet
//   const validImages = galleryData?.child_images?.filter(item => item?.child_content?.image) || [];

//   return (
//     <MainLayout>
//       <main>
//         <section className="container my-5">
//           <div className="row g-4 mx-0">
//             <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "Experience Center Gallery"}</h4>
            
//             {/* Dynamic Grid Mapping */}
// {validImages.map((item, index) => {
//   // Make every 3rd image full-width (index 2, 5, 8, etc.)
//   const colClass = (index + 1) % 3 === 0 ? "col-lg-12" : "col-lg-6";

//   return (
//     <div key={index} className={colClass}>
//       <GalleryDetail
//         imgGalUrl={item.child_content.image}
//         imgGalAlt={defaultAltText}
//         imgGalImgClass="w-100 detail_gal_img"
//         images={validImages}
//       />
//     </div>
//   );
// })}
            
//             {validImages.length === 0 && (
//               <div className="col-12 text-center text-muted py-5">
//                 No gallery images uploaded yet.
//               </div>
//             )}
//           </div>
//         </section>
//         <hr />
//       </main>
//     </MainLayout>
//   );
// }

"use client";
import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";

export default function GalleryClient({ galleryData }) {
  // Filter out any empty rows just in case some child slots aren't filled yet
  const validImages = galleryData?.child_images?.filter((item) => item?.child_content?.image) || [];

  return (
    <MainLayout>
      <main>
        <section className="container my-5">
          <div className="row g-4 mx-0">
            <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "Experience Center Gallery"}</h4>

            {/* Dynamic Grid Mapping — no limit on how many child images
                there are. Paired two-per-row (col-lg-6 each); if the count
                is odd, the trailing single image spans the full row
                (col-lg-12) instead of sitting next to empty space. */}
            {validImages.map((item, index) => {
              const isLastOdd = index === validImages.length - 1 && validImages.length % 2 === 1;
              const colClass = isLastOdd ? "col-lg-12" : "col-lg-6";

              return (
                <div key={index} className={colClass}>
                  <GalleryDetail
                    imgGalUrl={item.child_content.image}
                    imgGalAlt={defaultAltText}
                    imgGalImgClass="w-100 detail_gal_img"
                    images={validImages}
                  />
                </div>
              );
            })}

            {validImages.length === 0 && (
              <div className="col-12 text-center text-muted py-5">
                No gallery images uploaded yet.
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
