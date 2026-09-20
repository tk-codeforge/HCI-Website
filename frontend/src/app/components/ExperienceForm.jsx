// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";

// const ExperienceForm = () => {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     contactNo: "",
//     email: "",
//     place: "",
//     query: "",
//     termsAccepted: false,
//   });

//   const [submissionError, setSubmissionError] = useState("");
//   const [submissionMessage, setSubmissionMessage] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({
//     fullName: false,
//     email: false,
//     contactNo: false,
//     place: false,
//     query: false,
//   });

//   // Handle input change for text fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: checked }));
//   };

//   // Validate form fields
//   const validateForm = () => {
//     const errors = {
//       fullName: formData.fullName.trim() === "",
//       email: !/^\S+@\S+\.\S+$/.test(formData.email),
//       contactNo: formData.contactNo.trim() === "",
//       place: formData.place.trim() === "",
//       query: formData.query.trim() === "",
//       termsAccepted: !formData.termsAccepted,
//     };

//     setFieldErrors(errors);
//     return !Object.values(errors).some((error) => error === true);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setSubmissionError(
//         "Please fill in all required fields and accept the terms."
//       );
//       return;
//     }

//     const formRequestedData = {
//       name: formData.fullName,
//       email: formData.email,
//       mobile: formData.contactNo,
//       place: formData.place,
//       query: formData.query,
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Experience Center Gurugram Lead Form",
//         ctaText: "Get free Quote",
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", formRequestedData);

//       if (response.status === 201) {
//         setSubmissionMessage("Form submitted successfully!");
//         setFormData({
//           fullName: "",
//           email: "",
//           contactNo: "",
//           place: "",
//           query: "",
//           termsAccepted: false,
//         });
//         setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         setSubmissionError("Failed to submit form. Please try again.");
//       }
//     } catch (error) {
//       setSubmissionError("Error submitting form. Please try again.");
//     } finally {
//       setTimeout(() => {
//         setSubmissionError("");
//         setSubmissionMessage("");
//       }, 5000);
//     }
//   };

//   return (
//     <div className="text-white form_experience_center mx-0">
//       <form onSubmit={handleSubmit}>
//         <h5 className="text-center text-white">Design for Every Budget</h5>
//         <p className="mb-4 text-center text-white">
//           Get Your Dream house today. Let Our experts help you.
//         </p>

//         {/* Full Name */}
//         <div className="mt-3 mb-3">
//           <input
//             type="text"
//             className={`form-control ${
//               fieldErrors.fullName ? "is-invalid" : ""
//             }`}
//             placeholder="Name"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleInputChange}
//             required
//           />
//           {fieldErrors.fullName && (
//             <div className="invalid-feedback">Please enter your full name.</div>
//           )}
//         </div>

//         <div className="mb-3 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             name="contactNo"
//             placeholder="Contact No."
//             value={formData.contactNo}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         {/* Email */}
//         <div className="mb-3">
//           <input
//             type="email"
//             className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
//             placeholder="Email ID"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//           {fieldErrors.email && (
//             <div className="invalid-feedback">
//               Please enter a valid email address.
//             </div>
//           )}
//         </div>

//         <div className="mb-3 col-md-12">
//           <input
//             type="text"
//             className="form-control"
//             name="place"
//             value={formData.place}
//             onChange={handleInputChange}
//             placeholder="Place"
//             required
//           />
//         </div>

//         <div className="mb-3 col-md-12">
//           <textarea
//             className="form-control"
//             name="query"
//             placeholder="Query"
//             rows="3"
//             value={formData.query}
//             onChange={handleInputChange}
//           ></textarea>
//         </div>

//         {/* Submit Button */}
//         <div className="mb-3">
//           <button type="submit" className="mb-3 know_more w-100">
//             Get free Quote
//           </button>
//         </div>

//         {/* Terms and Conditions */}
//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className={`form-check-input ${
//               fieldErrors.termsAccepted ? "is-invalid" : ""
//             }`}
//             name="termsAccepted"
//             checked={formData.termsAccepted}
//             onChange={handleCheckboxChange}
//             required
//           />
//           <label
//             className="text-white form-check-label"
//             htmlFor="exampleCheck1"
//           >
//             By submitting this form, you agree to the{" "}
//             <a href="#" className="text-warning">
//               privacy policy
//             </a>{" "}
//             &{" "}
//             <a href="#" className="text-warning">
//               terms and conditions
//             </a>
//             .
//           </label>
//           {fieldErrors.termsAccepted && (
//             <div className="invalid-feedback">
//               You must accept the terms and conditions.
//             </div>
//           )}
//         </div>

//         {submissionError && (
//           <div className="text-center alert alert-danger">{submissionError}</div>
//         )}
//         {submissionMessage && (
//           <div className="text-center alert alert-success">
//             {submissionMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ExperienceForm;

// "use client";

// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";

// const CENTER_NAMES_BY_PATH = {
//   "/experience-center-noida-extension": "Noida Extension",
//   "/experience-center": "Noida",
//   "/experience-center-gurugram": "Gurugram",
//   "/experience-center-faridabad": "Faridabad",
//   "/experience-center-new-delhi": "New Delhi",
// };

// function getCenterNameFromPath(pathname) {
//   return CENTER_NAMES_BY_PATH[pathname] || "Experience Center";
// }

// export const EXPERIENCE_FORM_DEFAULT_CONFIG = {
//   backgroundColor: "", 
//   fontColor: "#ffffff",
//   heading: "Design for Every Budget",
//   subheading: "Get Your Dream house today. Let Our experts help you.",
//   fields: {
//     fullName: { label: "Name", placeholder: "Name", required: true, enabled: true },
//     contactNo: { label: "Contact No.", placeholder: "Contact No.", required: true, enabled: true },
//     email: { label: "Email ID", placeholder: "Email ID", required: true, enabled: true },
//     place: { label: "Place", placeholder: "Place", required: true, enabled: true },
//     query: { label: "Query", placeholder: "Query", required: false, enabled: true },
//   },
//   submitButton: {
//     text: "Get free Quote",
//     bgColor: "#ff914d",
//     textColor: "#ffffff",
//   },
//   checkboxText:
//     "By submitting this form, you agree to the privacy policy & terms and conditions.",
//   checkboxLinks: [
//     { text: "privacy policy", url: "/privacy-policy" },
//     { text: "terms and conditions", url: "/terms-and-conditions" },
//   ],
// };

// const FIELD_ORDER = ["fullName", "contactNo", "email", "place", "query"];

// export function renderCheckboxText(text, links, color) {
//   const usableLinks = (links || []).filter((l) => l?.text);
//   if (usableLinks.length === 0) return text;

//   const escaped = usableLinks.map((l) =>
//     l.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
//   );
//   const regex = new RegExp(`(${escaped.join("|")})`, "g");
//   const parts = text.split(regex);

//   return parts.map((part, i) => {
//     const match = usableLinks.find((l) => l.text === part);
//     if (!match) return <span key={i}>{part}</span>;
//     const isExternal = /^https?:\/\//.test(match.url || "");
//     return (
//       <a
//         key={i}
//         href={match.url || "#"}
//         className="exp-checkbox-link"
//         style={{ color: "#ffc107", textDecoration: "none" }}
//         target={isExternal ? "_blank" : undefined}
//         rel={isExternal ? "noopener noreferrer" : undefined}
//       >
//         {part}
//       </a>
//     );
//   });
// }

// const ExperienceForm = () => {
//   const pathname = usePathname();
//   const [config, setConfig] = useState(EXPERIENCE_FORM_DEFAULT_CONFIG);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     contactNo: "",
//     email: "",
//     place: "",
//     query: "",
//     termsAccepted: false,
//   });

//   const [submissionError, setSubmissionError] = useState("");
//   const [submissionMessage, setSubmissionMessage] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({
//     fullName: false,
//     email: false,
//     contactNo: false,
//     place: false,
//     query: false,
//     termsAccepted: false,
//   });

//   useEffect(() => {
//     let isMounted = true;
//     (async () => {
//       try {
//         const res = await api.get("/cms-content/experience_center_form");
//         const record = Array.isArray(res.data) ? res.data[0] : res.data;
//         const content = record?.json_content;
//         if (isMounted && content) {
//           setConfig({
//             ...EXPERIENCE_FORM_DEFAULT_CONFIG,
//             ...content,
//             fields: {
//               ...EXPERIENCE_FORM_DEFAULT_CONFIG.fields,
//               ...(content.fields || {}),
//             },
//             submitButton: {
//               ...EXPERIENCE_FORM_DEFAULT_CONFIG.submitButton,
//               ...(content.submitButton || {}),
//             },
//             checkboxLinks:
//               content.checkboxLinks || EXPERIENCE_FORM_DEFAULT_CONFIG.checkboxLinks,
//           });
//         }
//       } catch (err) {
//         // CMS not reachable / not configured yet — keep fallback copy.
//       }
//     })();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: checked }));
//   };

//   const validateForm = () => {
//     const errors = {};

//     FIELD_ORDER.forEach((key) => {
//       const fieldCfg = config.fields[key];
//       if (!fieldCfg?.enabled) {
//         errors[key] = false;
//         return;
//       }
//       if (key === "email") {
//         errors[key] =
//           fieldCfg.required && !/^\S+@\S+\.\S+$/.test(formData.email);
//       } else {
//         errors[key] = fieldCfg.required && formData[key].trim() === "";
//       }
//     });

//     errors.termsAccepted = !formData.termsAccepted;

//     setFieldErrors(errors);
//     return !Object.values(errors).some((error) => error === true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setSubmissionError(
//         "Please fill in all required fields and accept the terms."
//       );
//       return;
//     }

//     const formRequestedData = {
//       name: formData.fullName,
//       email: formData.email,
//       mobile: formData.contactNo,
//       place: formData.place,
//       query: formData.query,
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: `Experience Center ${getCenterNameFromPath(pathname)} Lead Form`,
//         ctaText: config.submitButton.text,
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", formRequestedData);

//       if (response.status === 201) {
//         setSubmissionMessage("Form submitted successfully!");
//         setFormData({
//           fullName: "",
//           email: "",
//           contactNo: "",
//           place: "",
//           query: "",
//           termsAccepted: false,
//         });
//         setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         setSubmissionError("Failed to submit form. Please try again.");
//       }
//     } catch (error) {
//       setSubmissionError("Error submitting form. Please try again.");
//     } finally {
//       setTimeout(() => {
//         setSubmissionError("");
//         setSubmissionMessage("");
//       }, 5000);
//     }
//   };

//   const wrapperStyle = {
//   ...(config.backgroundColor ? { backgroundColor: config.backgroundColor } : {}),
//   "--experience-font-color": config.fontColor || "#ffffff",
//   "--experience-submit-bg": config.submitButton.bgColor || "#ff914d",
//   "--experience-submit-color": config.submitButton.textColor || "#ffffff",
// };

//   return (
//     <div
//       className="form_experience_center mx-0"
//       style={wrapperStyle}
//     >
//       <style
//   dangerouslySetInnerHTML={{
//     __html: `
//       .form_experience_center .exp-heading,
//       .form_experience_center .exp-subheading,
//       .form_experience_center .exp-checkbox-label {
//         color: var(--experience-font-color) !important;
//       }
//       .form_experience_center .exp-checkbox-link {
//   color: #ffc107 !important;
//   text-decoration: none; 
// }
//       .form_experience_center .exp-submit-btn {
//         background-color: var(--experience-submit-bg) !important;
//         border-color: var(--experience-submit-bg) !important;
//         color: var(--experience-submit-color) !important;
//       }
//     `,
//   }}
// />
//       <form onSubmit={handleSubmit}>
//         <h5 className="text-center exp-heading" style={{ color: "var(--experience-font-color)" }}>
//           {config.heading}
//         </h5>
//         <p className="mb-4 text-center exp-subheading" style={{ color: "var(--experience-font-color)" }}>
//           {config.subheading}
//         </p>

//         {config.fields.fullName?.enabled && (
//           <div className="mt-3 mb-3">
//             <input
//               type="text"
//               className={`form-control ${
//                 fieldErrors.fullName ? "is-invalid" : ""
//               }`}
//               placeholder={config.fields.fullName.placeholder}
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               required={config.fields.fullName.required}
//             />
//             {fieldErrors.fullName && (
//               <div className="invalid-feedback">
//                 Please enter your {config.fields.fullName.label.toLowerCase()}.
//               </div>
//             )}
//           </div>
//         )}

//         {config.fields.contactNo?.enabled && (
//           <div className="mb-3 col-md-12">
//             <input
//               type="text"
//               className={`form-control ${
//                 fieldErrors.contactNo ? "is-invalid" : ""
//               }`}
//               name="contactNo"
//               placeholder={config.fields.contactNo.placeholder}
//               value={formData.contactNo}
//               onChange={handleInputChange}
//               required={config.fields.contactNo.required}
//             />
//           </div>
//         )}

//         {config.fields.email?.enabled && (
//           <div className="mb-3">
//             <input
//               type="email"
//               className={`form-control ${
//                 fieldErrors.email ? "is-invalid" : ""
//               }`}
//               placeholder={config.fields.email.placeholder}
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               required={config.fields.email.required}
//             />
//             {fieldErrors.email && (
//               <div className="invalid-feedback">
//                 Please enter a valid email address.
//               </div>
//             )}
//           </div>
//         )}

//         {config.fields.place?.enabled && (
//           <div className="mb-3 col-md-12">
//             <input
//               type="text"
//               className={`form-control ${
//                 fieldErrors.place ? "is-invalid" : ""
//               }`}
//               name="place"
//               value={formData.place}
//               onChange={handleInputChange}
//               placeholder={config.fields.place.placeholder}
//               required={config.fields.place.required}
//             />
//           </div>
//         )}

//         {config.fields.query?.enabled && (
//           <div className="mb-3 col-md-12">
//             <textarea
//               className={`form-control ${
//                 fieldErrors.query ? "is-invalid" : ""
//               }`}
//               name="query"
//               placeholder={config.fields.query.placeholder}
//               rows="3"
//               value={formData.query}
//               onChange={handleInputChange}
//               required={config.fields.query.required}
//             ></textarea>
//           </div>
//         )}

//         <div className="mb-3">
//           <button
//             type="submit"
//             className="mb-3 know_more exp-submit-btn w-100"
//           >
//             {config.submitButton.text}
//           </button>
//         </div>

//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className={`form-check-input ${
//               fieldErrors.termsAccepted ? "is-invalid" : ""
//             }`}
//             name="termsAccepted"
//             checked={formData.termsAccepted}
//             onChange={handleCheckboxChange}
//             required
//           />
//           <label
//             className="form-check-label exp-checkbox-label"
//             htmlFor="exampleCheck1"
//           >
//             {renderCheckboxText(config.checkboxText, config.checkboxLinks, config.fontColor)}
//           </label>
//           {fieldErrors.termsAccepted && (
//             <div className="invalid-feedback">
//               You must accept the terms and conditions.
//             </div>
//           )}
//         </div>

//         {submissionError && (
//           <div className="text-center alert alert-danger">{submissionError}</div>
//         )}
//         {submissionMessage && (
//           <div className="text-center alert alert-success">
//             {submissionMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default ExperienceForm;


import ExperienceFormClient from "./ExperienceFormClient";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
};

async function fetchFormConfig() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/experience_center_form`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    return record?.json_content || null;
  } catch (err) {
    console.error("Failed to fetch form config on server:", err);
    return null;
  }
}

export default async function ExperienceForm() {
  const formConfig = await fetchFormConfig();
  return <ExperienceFormClient initialConfig={formConfig} />;
}