import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { notFound } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";
const BASE_URL = "https://hcinterior.in";

async function getGalleryData(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-parent-child/by-id/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  const canonicalUrl = id 
    ? `${BASE_URL}/ready-togo-design/gallery?id=${id}` 
    : `${BASE_URL}/ready-togo-design/gallery`;

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const ResidentialProjectsGallery = async ({ searchParams }) => {
  const id = searchParams?.id;
  
  if (!id) return notFound();

  const galleryData = await getGalleryData(id);

  if (!galleryData) return notFound();

  const images = galleryData?.child_images ?? [];
  const title = galleryData?.child_content?.title ?? "Ready to go Gallery";

  // If there are no images, show a graceful fallback
  if (images.length === 0) {
    return (
      <MainLayout>
        <main className="container my-5 py-5 text-center">
           <h2 className="font-outfit text-muted">No images found for this gallery.</h2>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="bg-light pb-5">
        
        {/* Modern Header Section */}
        <section className="py-5 bg-white border-bottom shadow-sm mb-5">
          <div className="container text-center">
             <h1 className="font-outfit fw-bold text-dark mb-2">{title}</h1>
             <p className="font-poppins text-muted mb-0">Explore our exclusive, ready-to-execute designs.</p>
          </div>
        </section>

        {/* Dynamic Masonry-Style Grid */}
        <section className="container">
          <div className="row g-4">
            {images.map((img, index) => {
              // Create a dynamic pattern: Mix of tall (col-lg-12) and standard (col-lg-6) blocks.
              // Every 3rd image spans full width, others take half width.
              const isLarge = (index + 1) % 3 === 0; 
              
              return (
                <div key={index} className={isLarge ? "col-lg-12 col-12" : "col-lg-6 col-md-6 col-12"}>
                  <div style={{ height: isLarge ? '500px' : '350px' }}>
                    <GalleryDetail
                      imgGalUrl={img?.image ?? "/images/default.jpg"}
                      imgGalAlt={img?.title || defaultAltText}
                      imgGalImgClass="" // Class removed as styling is now handled by the component
                      images={images} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </MainLayout>
  );
};

export default ResidentialProjectsGallery;