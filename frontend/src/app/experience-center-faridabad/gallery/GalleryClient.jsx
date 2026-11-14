// "use client";
// import GalleryDetail from "../../components/GalleryDetail";
// import MainLayout from "../../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";

// export default function GalleryClient({ galleryData }) {
//   return (
//     <MainLayout>
//       <main>
//         <section className="container my-5">
//           <div className="row g-4 mx-0">
//             <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "Faridabad Gallery"}</h4>
            

//             {/* Dynamic Grid Mapping: 2 half-width, then 1 full-width, repeating */}
// {galleryData.child_images?.map((item, index, all) => {
//   const isFull =
//     index % 3 === 2 ||                              // 3rd, 6th, 9th... image
//     (index === all.length - 1 && index % 3 === 0);  // last image would otherwise sit alone

//   return (
//     <div key={index} className={isFull ? "col-lg-12" : "col-lg-6"}>
//       <GalleryDetail
//         imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
//                 imgGalAlt={galleryData?.child_content?.title || defaultAltText}
//         imgGalCmsAlt={item.image_alt}
//         imgGalImgClass={isFull ? "w-100 detail_gal_img2" : "w-100 detail_gal_img"}
//         images={all}
//       />
//     </div>
//   );
// })}
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
import DOMPurify from "isomorphic-dompurify";
import { defaultAltText } from "@/utils/helper";
import { DEFAULT_CHILD_TAG, childFromContent, safeTag } from "@/utils/noidaCenterSettings";

export default function GalleryClient({ galleryData }) {
  // Heading: CMS heading if set, otherwise the parent title. The same value is the
  // fallback alt text for child images that have no alt text of their own.
  const childContent = childFromContent(galleryData?.child_content);
  const parentTitle = galleryData?.child_content?.title ?? "Faridabad Gallery";
  const heading = childContent.heading.trim() || parentTitle;
  const HeadingTag = safeTag(childContent.headingTag, DEFAULT_CHILD_TAG);
  const richHtml = childContent.html.trim()
    ? DOMPurify.sanitize(childContent.html, { ADD_ATTR: ["target", "rel"] })
    : "";

  return (
    <MainLayout>
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
{galleryData.child_images?.map((item, index, all) => {
  const isFull =
    index % 3 === 2 ||                              // 3rd, 6th, 9th... image
    (index === all.length - 1 && index % 3 === 0);  // last image would otherwise sit alone

  return (
    <div key={index} className={isFull ? "col-lg-12" : "col-lg-6"}>
      <GalleryDetail
        imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
                imgGalAlt={heading || defaultAltText}
        imgGalCmsAlt={item.image_alt}
        imgGalImgClass={isFull ? "w-100 detail_gal_img2" : "w-100 detail_gal_img"}
        images={all}
      />
    </div>
  );
})}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}