// "use client";
// import { useState } from "react";
// import MainLayout from "../../layouts/MainLayout";
// import BackgroundImageWithHeading from "../../components/BackgroundImageWithHeading";

// import api from "@/utils/api";
// import { toast } from "react-toastify";
// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     your_job_title: "",
//     resume: null,
//   });


//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "resume" && files.length > 0) {
//       setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const jobId = new URLSearchParams(window.location.search).get("jobId") ?? null;

//     const formDataToSend = new FormData();
//     formDataToSend.append("job_id", jobId);
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("email", formData.email);
//     formDataToSend.append("phone", formData.phone);
//     formDataToSend.append("your_job_title", formData.your_job_title);
//     if (formData.resume) {
//       formDataToSend.append("resume", formData.resume);
//     }

//     try {
//       // Send POST request to save form data
//       const response = await api.post(`/job-application`, formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data"
//         },
//       });

//       // Handle success response
//       if (response.status === 201) {
//         toast.success("Form submitted successfully.");
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           your_job_title: "",
//           resume: null,
//         });

//       } else {
//         toast.error("Error submitting form. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error.message ?? "Error submitting form. Please try again.");
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div>
//       <head>
//         <title>
//         Career form - High Creation Interior

//         </title>
//       </head>
//       <MainLayout>
//         <main>
       

//           <BackgroundImageWithHeading
//             sectionBgImages={"contact_wrapper   career_form_banner"}
//             sectionBgHeading="Career Form"
//             secBgHeadingClass="sec_bgheading_lass" 
//             sectionBgDescription=""
//             secBgDesClass={"text-center text-white"}
//           />

//           <section className="container my-5 map">
//             <div className="row mx-0 g-3">
//               <div className="col-lg-5 d-flex align-items-center">
//                 <div className="pe-lg-5">
//                   <h2 className="pb-4"> High Creation Interior Team</h2>
//                   <p>
//                     Can’t find something suitable, but eager to work with us?
//                     Write to us at hr@hcinterior.in and we’ll try to make it
//                     happen.
//                   </p>
//                 </div>
//               </div>
//               <div className="col-lg-7">
//                 <div className="contact_form contact">
//                   <h4 className="mb-4 text-black form_heading">Apply Now</h4>
//                   <form className="row" onSubmit={handleSubmit}>
//                     <div className="mb-3 col-md-6">
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="name"
//                         placeholder="Full Name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="mb-3 col-md-6">
//                       <input
//                         type="email"
//                         className="form-control"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="mb-3 col-md-6">
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="phone"
//                         placeholder="Contact No."
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>

//                     <div className="mb-3 col-md-6">
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="your_job_title"
//                         placeholder="Job Position"
//                         value={formData.your_job_title}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="mb-3 col-md-12">
//                       {/* <input
//                         type="text"
//                         className="form-control"
//                         name="place"
//                         value=""
//                         onChange=""
//                         placeholder="Place"
//                         required
//                       /> */}
//                       <div className="input-group mb-3">
//                         <input
//                           type="file"
//                           className="form-control me-2 w-75"
//                           id="inputGroupFile02"
//                           placeholder="Resumne"
//                           name="resume"
//                           accept="application/pdf"
//                           onChange={handleInputChange}
//                         />
//                         <label
//                           className="input-group-text rounded-5 mt-3 mt-lg-0"
//                           htmlFor="inputGroupFile02"
//                         >
//                           Upload your resume
//                         </label>
//                       </div>
//                     </div>

//                     {/* <div className="mb-3 col-md-12">
//                       <textarea
//                         className="form-control"
//                         name="query"
//                         placeholder="Query"
//                         rows="3"
//                         value=""
//                         onChange=""
//                       ></textarea>
//                     </div> */}

//                     <div className="col-12">
//                       <div className="form-check">
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="invalidCheck"
//                           value=""
//                           onChange=""
//                           required
//                         />
//                         <label
//                           className="text-black form-check-label"
//                           htmlFor="invalidCheck"
//                         >
//                           Accept Terms & Conditions
//                         </label>
//                         <div className="text-black invalid-feedback">
//                           You must agree before submitting.
//                         </div>
//                       </div>
//                     </div>

//                     <div className="m-auto mt-3 col-12 d-flex justify-content-center">
//                       <button className="px-5 know_more" type="submit">
//                         Submit
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//         <hr />
//       </MainLayout>
//     </div>
//   );
// };

// export default Contact;

"use client";

import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import BackgroundImageWithHeading from "../../components/BackgroundImageWithHeading";
import api from "@/utils/api";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    your_job_title: "",
    resume: null,
  });

  const [cmsSettings, setCmsSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetchPageSettings();
  }, []);

  // Fetch Page Settings from CMS
  const fetchPageSettings = async () => {
    try {
      // const res = await api.get("/cms-parent-child/page-type/career_form");
      const res = await api.get("/cms-parent-child/career_form");
      const record = Array.isArray(res.data) ? res.data[0] : null;
      const content = record?.child_content;

      if (content) {
        let parsedLinks = [];
        if (content.checkbox_links) {
          try {
            parsedLinks =
              typeof content.checkbox_links === "string"
                ? JSON.parse(content.checkbox_links)
                : content.checkbox_links;
          } catch (e) {
            console.error("Error parsing checkbox_links JSON", e);
          }
        } else if (content.checkbox_text) {
          parsedLinks = [
            { text: content.checkbox_text, url: content.checkbox_link || "" },
          ];
        }
        let parsedJobTexts = {};
if (content.job_texts) {
  try {
    parsedJobTexts =
      typeof content.job_texts === "string"
        ? JSON.parse(content.job_texts)
        : content.job_texts;
  } catch (e) {
    console.error("Error parsing job_texts JSON", e);
  }
}

        setCmsSettings({
          ...content,
          checkbox_text: content.checkbox_text || "",
          checkbox_links: parsedLinks,
          job_texts: parsedJobTexts,
        });
      }
    } catch (err) {
      console.error("Failed to fetch career form settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" && files?.length > 0) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobId =
      new URLSearchParams(window.location.search).get("jobId") ?? null;

    const formDataToSend = new FormData();
    formDataToSend.append("job_id", jobId);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("your_job_title", formData.your_job_title);
    if (formData.resume) {
      formDataToSend.append("resume", formData.resume);
    }

    try {
      const response = await api.post(`/job-application`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Form submitted successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          your_job_title: "",
          resume: null,
        });
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    } catch (error) {
      toast.error(error.message ?? "Error submitting form. Please try again.");
      console.error("Error submitting application:", error);
    }
  };
const jobId = new URLSearchParams(
  typeof window !== "undefined" ? window.location.search : ""
).get("jobId");
const jobText = cmsSettings?.job_texts?.[jobId] || {};

  return (
    <div>
      <head>
        <title>Career form - High Creation Interior</title>
      </head>
      <MainLayout>
        <main>
          {/* <BackgroundImageWithHeading
            sectionBgImages={
              cmsSettings?.image ? "" : "contact_wrapper career_form_banner"
            }
            bgImageUrl={cmsSettings?.image}
            sectionBgHeading={cmsSettings?.title || "Career Form"}
            secBgHeadingClass="sec_bgheading_lass"
            sectionBgDescription=""
            secBgDesClass={"text-center text-white"}
          /> */}
          <BackgroundImageWithHeading
 sectionBgImages={"contact_wrapper career_form_banner"}
   sectionBgHeading={cmsSettings?.title || "Career Form"}
   secBgHeadingClass="sec_bgheading_lass"
   sectionBgDescription=""
   secBgDesClass={"text-center text-white"}
 />
 {(cmsSettings?.bg_color || cmsSettings?.font_color) && (
  <style>{`
    .career-form-card {
      ${cmsSettings?.bg_color ? `background-color: ${cmsSettings.bg_color} !important;` : ""}
      ${cmsSettings?.font_color ? `color: ${cmsSettings.font_color} !important;` : ""}
    }
  `}</style>
)}
{(cmsSettings?.submit_button_color || cmsSettings?.submit_button_text_color) && (
  <style>{`
    .career-form-submit-btn {
      ${cmsSettings?.submit_button_color ? `background-color: ${cmsSettings.submit_button_color} !important; border-color: ${cmsSettings.submit_button_color} !important;` : ""}
      ${cmsSettings?.submit_button_text_color ? `color: ${cmsSettings.submit_button_text_color} !important;` : ""}
    }
      .career-form-card h4.career-form-title {
  ${cmsSettings?.font_color ? `color: ${cmsSettings.font_color} !important;` : ""}
}
  .career-form-card .career-form-checkbox-link {
  color: #ffc107 !important;
  text-decoration: underline;
}
  `}</style>
)}


          <section className="container my-5 map">
            <div className="row mx-0 g-3">
              <div className="col-lg-5 d-flex align-items-center">
                <div className="pe-lg-5">
                  {/* <h2 className="pb-4"> High Creation Interior Team</h2>
                  <p>
                    Can’t find something suitable, but eager to work with us?
                    Write to us at hr@hcinterior.in and we’ll try to make it
                    happen.
                  </p> */}
                  {/* <h2 className="pb-4">{jobText.heading || "High Creation Interior Team"}</h2> */}
{jobText.paragraph ? (
  <div dangerouslySetInnerHTML={{ __html: jobText.paragraph }} />
) : (
   <p>
     Can't find something suitable, but eager to work with us?
     Write to us at hr@hcinterior.in and we'll try to make it
     happen.
   </p>
 )}
                </div>
              </div>
              <div className="col-lg-7">
                {/* <div
                  className="contact_form contact p-4"
                  style={{
                    backgroundColor: cmsSettings?.bg_color || "inherit",
                    color: cmsSettings?.font_color || "inherit",
                    borderRadius: "24px",
                  }}
                > */}
                 <div
  className="contact_form contact p-4 career-form-card"
 style={{ borderRadius: "24px" }}
 >
                  <h4
                    className="mb-4 career-form-title"
                    style={{ color: cmsSettings?.font_color || "#000000" }}
                  >
                    {cmsSettings?.form_heading || "Apply Now"}
                  </h4>
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="mb-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder={
                          cmsSettings?.placeholder_name || "Full Name"
                        }
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder={
                          cmsSettings?.placeholder_email || "Email"
                        }
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        placeholder={
                          cmsSettings?.placeholder_phone || "Contact No."
                        }
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3 col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        name="your_job_title"
                        placeholder={
                          cmsSettings?.placeholder_job_position ||
                          "Job Position"
                        }
                        value={formData.your_job_title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3 col-md-12">
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          className="form-control me-2 w-75"
                          id="inputGroupFile02"
                          name="resume"
                          accept="application/pdf"
                          onChange={handleInputChange}
                        />
                        <label
                          className="input-group-text rounded-5 mt-3 mt-lg-0"
                          htmlFor="inputGroupFile02"
                        >
                          {cmsSettings?.resume_button_label ||
                            "Upload your resume"}
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="invalidCheck"
                          required
                        />
                        <label
                          className="form-check-label ms-1"
                          htmlFor="invalidCheck"
                          style={{
                            color: cmsSettings?.font_color || "#000000",
                          }}
                        >
                          {cmsSettings?.checkbox_text && (
    <span className="me-1">{cmsSettings.checkbox_text}</span>
  )}
                          {cmsSettings?.checkbox_links &&
                          cmsSettings.checkbox_links.length > 0 ? (
                            cmsSettings.checkbox_links.map((link, idx) => (
                              <span key={idx}>
                                {idx > 0 && " "}
                                {link.url ? (
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="career-form-checkbox-link"
                                  >
                                    {link.text}
                                  </a>
                                ) : (
                                  link.text
                                )}
                              </span>
                            ))
                          ) : (
                            !cmsSettings?.checkbox_text && "Accept Terms & Conditions"
                          )}
                        </label>
                        <div
                          className="invalid-feedback"
                          style={{
                            color: cmsSettings?.font_color || "inherit",
                          }}
                        >
                          You must agree before submitting.
                        </div>
                      </div>
                    </div>

                    <div className="m-auto mt-3 col-12 d-flex justify-content-center">
                      <button
                        className="px-5 know_more career-form-submit-btn"
                        type="submit"
                      >
                        {cmsSettings?.submit_button_text || "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
        <hr />
      </MainLayout>
    </div>
  );
};

export default Contact;
