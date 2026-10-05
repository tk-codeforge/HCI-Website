"use client";
import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";

export default function GalleryClient({ galleryData }) {
  return (
    <MainLayout>
      <main>
        <section className="container my-5">
          <div className="row g-4 mx-0">
            <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "New Delhi Gallery"}</h4>
            
            {/* Dynamic Grid Mapping
            {galleryData.child_images?.map((item, index) => (
              <div key={index} className="col-lg-6">
                <GalleryDetail
                  imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={galleryData.child_images}
                />
              </div>
            ))} */}

            {/* Dynamic Grid Mapping: 2 half-width, then 1 full-width, repeating */}
{galleryData.child_images?.map((item, index, all) => {
  const isFull =
    index % 3 === 2 ||                              // 3rd, 6th, 9th... image
    (index === all.length - 1 && index % 3 === 0);  // last image would otherwise sit alone

  return (
    <div key={index} className={isFull ? "col-lg-12" : "col-lg-6"}>
      <GalleryDetail
        imgGalUrl={item.image ?? `/images/detail-img/${index + 1}.webp`}
        imgGalAlt={defaultAltText}
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