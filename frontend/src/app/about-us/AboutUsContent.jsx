"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";
import BackgroundImageRow from "../components/BackgroundImageRow";
import MainLayout from "../layouts/MainLayout";

const AboutUsContent = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    top_title: "",
    top_title_tag: "h2",
    top_description: "",
    top_description_font_size: "",
    mid_sub_title: "",
    mid_sub_title_tag: "h3",
    mid_sub_description: "",
    mid_sub_description_font_size: "",
    mid_image: "",
    mid_image_size: "100",
  });

  const fetchAboutUsContent = useCallback(async () => {
    try {
      const response = await api.get("/cms-content/about_us");
      if (response.data && response.data.json_content) {
        // setFormData({
        //   top_title: response.data.json_content.top_title || "",
        //   top_title_tag: content.top_title_tag || "h2",
        //   top_description: response.data.json_content.top_description || "",
        //   top_description_font_size: content.top_description_font_size || "",
        //   mid_sub_title: response.data.json_content.mid_sub_title || "",
        //   mid_sub_title_tag: content.mid_sub_title_tag || "h3",
        //   mid_sub_description: response.data.json_content.mid_sub_description || "",
        //   mid_sub_description_font_size: content.mid_sub_description_font_size || "",
        //   mid_image: response.data.json_content.mid_image || "",
        //   mid_image_size: response.data.json_content.mid_image_size || "100",
        // });
        const content = response.data.json_content;
        setFormData({
  top_title: content.top_title || "",
  top_title_tag: content.top_title_tag || "h2", // Added
  top_description: content.top_description || "",
  top_description_font_size: content.top_description_font_size || "", // Added
  mid_sub_title: content.mid_sub_title || "",
  mid_sub_title_tag: content.mid_sub_title_tag || "h3", // Added
  mid_sub_description: content.mid_sub_description || "",
  mid_sub_description_font_size: content.mid_sub_description_font_size || "", // Added
  mid_image: content.mid_image || "",
  mid_image_size: content.mid_image_size || "100",
});
      }
    } catch (error) {
      toast.error("Failed to load About Us data.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutUsContent();
  }, [fetchAboutUsContent]);

  if (loading) return <p className="text-center">Loading...</p>;

  const TopTitleTag = formData.top_title_tag || "h2";
const SubTitleTag = formData.mid_sub_title_tag || "h3";

  return (
    <MainLayout>
      <main>
        <BackgroundImageRow
          sectionBgImages="contact_wrapper about_us_banner"
          sectionBgHeading="About Us"
          secBgHeadingClass="sec_bgheading_lass about_mob"
          sectionBgDescription="400+ in-house professionals,  

We have successfully completed over 2671+ projects, with many more on the horizon. "
          secBgDesClass="text-center bg-transparent text-white"
        />
        <section className="my-5 container">
          <div className="row mx-0">
            <center>
              <TopTitleTag className="pb-4 wallpaperHeading" style={{ textShadow: "none" }}>{formData.top_title}</TopTitleTag>
              <div className="row justify-content-center">
                <div className="col-6 d-flex justify-content-center">
                  <img src={formData.mid_image || ""}  className="d-block"
                  style={{ 
    width: formData?.mid_image_size ? `${formData.mid_image_size}%` : '100%', 
    maxWidth: 'none', 
    height: 'auto' 
  }} 
  alt="About High Creation" decoding="async"  loading="lazy" />
                </div>
              </div>
              <p className="px-lg-5 pt-4 team_description" style={{ fontSize: formData.top_description_font_size ? `${formData.top_description_font_size}px` : undefined }}>{formData.top_description}</p>
            </center>
          </div>
        </section>
        <section className="whatmakes_wrapper">
          <div className="container">
            <div className="row mx-0">
              <div className="col-lg-7 d-flex align-items-center">
                <div>
                  <SubTitleTag>{formData.mid_sub_title}</SubTitleTag>
                  <div className="team_description text-white pe-lg-5" style={{ fontSize: formData.mid_sub_description_font_size ? `${formData.mid_sub_description_font_size}px` : undefined }}>
                    <p><span className="font_stylish text-white">Interior designing Company?</span></p>
                    {formData.mid_sub_description}
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <img src="/images/about/Whatmakes.png" className="w-100" alt="What makes us best" decoding="async"  loading="lazy" />
              </div>
            </div>
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
};

export default AboutUsContent;