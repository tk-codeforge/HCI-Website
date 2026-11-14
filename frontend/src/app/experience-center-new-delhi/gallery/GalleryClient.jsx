// import GalleryDetail from "../../components/GalleryDetail";
// import { defaultAltText } from "@/utils/helper";

// // No "use client" and no <MainLayout> here any more: this file has no
// // hooks/state, so it renders on the server. MainLayout is applied in page.jsx
// // (server) so the layout tree isn't pulled into the client bundle.
// export default function GalleryClient({ galleryData }) {
//   // Only send the fields the gallery uses (this array is serialized once per
//   // <GalleryDetail>, so trimming it matters with many images).
//   const all = (galleryData?.child_images ?? []).map((img) => ({
//     image: img?.image,
//     image_alt: img?.image_alt,
//     title: img?.title,
//   }));

//   return (
//     <main>
//       <section className="container my-5">
//         <div className="row g-4 mx-0">
//           <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "New Delhi Gallery"}</h4>

//           {/* Dynamic Grid Mapping: 2 half-width, then 1 full-width, repeating */}
//           {all.map((item, index) => {
//             const isFull =
//               index % 3 === 2 || // 3rd, 6th, 9th... image
//               (index === all.length - 1 && index % 3 === 0); // last image would otherwise sit alone

//             return (
//               <div key={index} className={isFull ? "col-lg-12" : "col-lg-6"}>
//                 <GalleryDetail
//                   imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
//                   imgGalAlt={galleryData?.child_content?.title || defaultAltText}
//                   imgGalCmsAlt={item.image_alt}
//                   imgGalImgClass={isFull ? "w-100 detail_gal_img2" : "w-100 detail_gal_img"}
//                   images={all}
//                   imgPriority={index === 0}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </section>
//       <hr />
//     </main>
//   );
// }



import GalleryDetail from "../../components/GalleryDetail";
import DOMPurify from "isomorphic-dompurify";
import { defaultAltText } from "@/utils/helper";
import { DEFAULT_CHILD_TAG, childFromContent, safeTag } from "@/utils/noidaCenterSettings";

// No "use client" and no <MainLayout> here any more: this file has no
// hooks/state, so it renders on the server. MainLayout is applied in page.jsx
// (server) so the layout tree isn't pulled into the client bundle.
export default function GalleryClient({ galleryData }) {
  // Only send the fields the gallery uses (this array is serialized once per
  // <GalleryDetail>, so trimming it matters with many images).
  const all = (galleryData?.child_images ?? []).map((img) => ({
    image: img?.image,
    image_alt: img?.image_alt,
    title: img?.title,
  }));

  // Heading: CMS heading if set, otherwise the parent title. The same value is the
  // fallback alt text for child images that have no alt text of their own.
  const childContent = childFromContent(galleryData?.child_content);
  const parentTitle = galleryData?.child_content?.title ?? "New Delhi Gallery";
  const heading = childContent.heading.trim() || parentTitle;
  const HeadingTag = safeTag(childContent.headingTag, DEFAULT_CHILD_TAG);
  const richHtml = childContent.html.trim()
    ? DOMPurify.sanitize(childContent.html, { ADD_ATTR: ["target", "rel"] })
    : "";

  return (
    <main>
      <section className="container my-5">
        <div className="row g-4 mx-0">
          <HeadingTag className="ps-3 mt-3">{heading}</HeadingTag>
          {/* Description (CKEditor text from CMS) sits right below the heading */}
          {richHtml ? (
            <div className="col-12 ps-3 pt-0 mt-0">
              <div className="hci-child-richtext" dangerouslySetInnerHTML={{ __html: richHtml }} />
            </div>
          ) : null}

          {/* Dynamic Grid Mapping: 2 half-width, then 1 full-width, repeating */}
          {all.map((item, index) => {
            const isFull =
              index % 3 === 2 || // 3rd, 6th, 9th... image
              (index === all.length - 1 && index % 3 === 0); // last image would otherwise sit alone

            return (
              <div key={index} className={isFull ? "col-lg-12" : "col-lg-6"}>
                <GalleryDetail
                  imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
                  imgGalAlt={heading || defaultAltText}
                  imgGalCmsAlt={item.image_alt}
                  imgGalImgClass={isFull ? "w-100 detail_gal_img2" : "w-100 detail_gal_img"}
                  images={all}
                  imgPriority={index === 0}
                />
              </div>
            );
          })}
        </div>
      </section>
      <hr />
    </main>
  );
}
