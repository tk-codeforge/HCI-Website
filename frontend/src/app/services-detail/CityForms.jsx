// "use client";
// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";
// import { FaUser, FaPhoneAlt, FaCheckCircle, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
// import styles from "./CityForms.module.css";

// const SUBMIT_BUTTON_STYLE = {
//   background: "linear-gradient(to right, #ff914d, #ff5722)",
//   border: "none",
// };

// const isValidMobile = (value) =>
//   /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, "").slice(-10));

// // 🌟 1. THE SMART SIDEBAR FORM
// export function SidebarForm({ city }) {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState({ fullName: "", contactNo: "", place: "" });
//   const [errors, setErrors] = useState({});
//   const [status, setStatus] = useState({ error: "", message: "" });
//   const [submitted, setSubmitted] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // clear the error for this field as the user types
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.fullName.trim()) newErrors.fullName = "Enter your full name";
//     if (!formData.contactNo.trim()) newErrors.contactNo = "Enter your mobile number";
//     else if (!isValidMobile(formData.contactNo))
//       newErrors.contactNo = "Enter a valid 10-digit mobile number";
//     if (!formData.place.trim()) newErrors.place = "Enter your location / city";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const response = await api.post("/user-queries", {
//         name: formData.fullName,
//         mobile: formData.contactNo,
//         email: "", // Maintain consistency with working forms
//         // Capture user input location, fallback to page city, or default
//         place: formData.place || city || "Not Specified",
//         query: "Quick Quote Request from Sidebar",
//         ...buildLeadMetadata({
//           pathname,
//           leadFormType: "sidebar",
//           leadFormName: "City Sidebar Form",
//           ctaText: "Get Free Estimate",
//         }),
//       });

//       if (response.status === 201) {
//         setSubmitted(true);
//         setFormData({ fullName: "", contactNo: "", place: "" });
//       } else {
//         setStatus({ error: "Failed to submit. Try again.", message: "" });
//       }
//     } catch (error) {
//       setStatus({ error: "Error submitting form.", message: "" });
//     } finally {
//       setTimeout(() => setStatus({ error: "", message: "" }), 5000);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="sidebar-widget mb-4 bg-white p-5 rounded-4 shadow-sm border text-center animate__animated animate__fadeIn">
//         <FaCheckCircle className="text-success mb-3" size={50} />
//         <h4 className="fw-bold font-outfit">Thank You!</h4>
//         <p className="text-muted small mb-0">
//           Our expert team will connect with you shortly to discuss your requirements.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="sidebar-widget mb-4 bg-white p-4 rounded-4 shadow-sm border">
//       <h4 className="fw-bold font-outfit mb-4 text-center">Get Free Consultation</h4>
//       <form onSubmit={handleSubmit} noValidate>
//         {status.error && <div className="alert alert-danger small py-2">{status.error}</div>}

//         {/* Full Name */}
//         <div className="mb-3">
//           <div className={styles.fieldWrap}>
//             <FaUser className={styles.fieldIcon} />
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="Full Name *"
//               className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.fullName ? styles.inputInvalid : ""}`}
//             />
//           </div>
//           {errors.fullName && <div className={styles.errorText}>{errors.fullName}</div>}
//         </div>

//         {/* Phone */}
//         <div className="mb-3">
//           <div className={styles.fieldWrap}>
//             <FaPhoneAlt className={styles.fieldIcon} />
//             <input
//               type="tel"
//               name="contactNo"
//               value={formData.contactNo}
//               onChange={handleInputChange}
//               placeholder="Phone Number *"
//               className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.contactNo ? styles.inputInvalid : ""}`}
//             />
//           </div>
//           {errors.contactNo && <div className={styles.errorText}>{errors.contactNo}</div>}
//         </div>

//         {/* Location */}
//         <div className="mb-3">
//           <div className={styles.fieldWrap}>
//             <FaMapMarkerAlt className={styles.fieldIcon} />
//             <input
//               type="text"
//               name="place"
//               value={formData.place}
//               onChange={handleInputChange}
//               placeholder="Location / City *"
//               className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.place ? styles.inputInvalid : ""}`}
//             />
//           </div>
//           {errors.place && <div className={styles.errorText}>{errors.place}</div>}
//         </div>

//         <button
//           type="submit"
//           className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm"
//           style={SUBMIT_BUTTON_STYLE}
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }

// // 🌟 2. THE BOTTOM CONTACT FORM
// export function BottomContactForm({ mapSrc }) {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     contactNo: "",
//     email: "",
//     place: "",
//     query: "",
//     termsAccepted: false,
//   });
//   const [errors, setErrors] = useState({});
//   const [status, setStatus] = useState({ error: "", message: "" });
//   const [submitted, setSubmitted] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleCheckboxChange = (e) => {
//     setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
//     if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: "" }));
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.fullName.trim()) newErrors.fullName = "Enter your full name";
//     if (!formData.contactNo.trim()) newErrors.contactNo = "Enter your mobile number";
//     else if (!isValidMobile(formData.contactNo))
//       newErrors.contactNo = "Enter a valid 10-digit mobile number";
//     if (!formData.email.trim()) newErrors.email = "Enter your email address";
//     else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
//       newErrors.email = "Enter a valid email address";
//     if (!formData.place.trim()) newErrors.place = "Enter your location / city";
//     if (!formData.termsAccepted)
//       newErrors.termsAccepted = "You must agree to the Terms & Conditions";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const response = await api.post("/user-queries", {
//         name: formData.fullName,
//         mobile: formData.contactNo,
//         email: formData.email,
//         place: formData.place,
//         query: formData.query,
//         ...buildLeadMetadata({
//           pathname,
//           leadFormType: "inline",
//           leadFormName: "City Bottom Form",
//           ctaText: "SEND MESSAGE",
//         }),
//       });

//       if (response.status === 201) {
//         setSubmitted(true);
//         setFormData({
//           fullName: "",
//           contactNo: "",
//           email: "",
//           place: "",
//           query: "",
//           termsAccepted: false,
//         });
//       } else {
//         setStatus({ error: "Failed to submit. Please try again.", message: "" });
//       }
//     } catch (error) {
//       setStatus({ error: "Error submitting form. Please try again.", message: "" });
//     } finally {
//       setTimeout(() => setStatus({ error: "", message: "" }), 5000);
//     }
//   };

//   return (
//     <div className="premium-card bg-white border-0 mt-5 pt-4">
//       <div className="row position-relative mx-0 g-5">
//         <div className="col-lg-6 col-12">
//           <div
//             className="rounded overflow-hidden shadow-sm border"
//             style={{ minHeight: "525px", height: "100%" }}
//           >
//             <iframe
//               src={mapSrc || "https://www.google.com/maps/embed?..."}
//               width="100%"
//               height="100%"
//               style={{ border: 0, minHeight: "525px" }}
//               allowFullScreen=""
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             />
//           </div>
//         </div>

//         <div className="col-lg-6 col-12 d-flex flex-column justify-content-center">
//           {submitted ? (
//             <div className="text-center p-5 border rounded-4 bg-light animate__animated animate__zoomIn">
//               <FaCheckCircle className="text-success mb-4" size={70} />
//               <h2 className="font-outfit fw-bold mb-3">Request Received!</h2>
//               <p className="text-muted font-poppins fs-5">
//                 Thank you for reaching out. One of our design experts will contact you shortly to
//                 discuss your project.
//               </p>
//               <button
//                 className="btn btn-outline-dark mt-4 px-4 py-2 fw-bold"
//                 onClick={() => setSubmitted(false)}
//               >
//                 Submit Another Request
//               </button>
//             </div>
//           ) : (
//             <>
//               <h2 className="font-outfit fw-bold h3 mb-2 text-dark">Reach Out With Confidence</h2>
//               <p className="text-muted font-poppins mb-4">
//                 Fill out the form below and our design experts will contact you shortly.
//               </p>
//               <form className="row g-3 font-poppins" onSubmit={handleSubmit} noValidate>
//                 {status.error && (
//                   <div className="col-12">
//                     <div className="alert alert-danger">{status.error}</div>
//                   </div>
//                 )}

//                 {/* Full Name */}
//                 <div className="col-md-6">
//                   <div className={styles.fieldWrap}>
//                     <FaUser className={styles.fieldIcon} />
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleInputChange}
//                       placeholder="Full Name *"
//                       className={`form-control bg-light border-0 ${styles.iconInput} ${errors.fullName ? styles.inputInvalid : ""}`}
//                     />
//                   </div>
//                   {errors.fullName && <div className={styles.errorText}>{errors.fullName}</div>}
//                 </div>

//                 {/* Contact No */}
//                 <div className="col-md-6">
//                   <div className={styles.fieldWrap}>
//                     <FaPhoneAlt className={styles.fieldIcon} />
//                     <input
//                       type="tel"
//                       name="contactNo"
//                       value={formData.contactNo}
//                       onChange={handleInputChange}
//                       placeholder="Contact No. *"
//                       className={`form-control bg-light border-0 ${styles.iconInput} ${errors.contactNo ? styles.inputInvalid : ""}`}
//                     />
//                   </div>
//                   {errors.contactNo && <div className={styles.errorText}>{errors.contactNo}</div>}
//                 </div>

//                 {/* Email */}
//                 <div className="col-md-12">
//                   <div className={styles.fieldWrap}>
//                     <FaEnvelope className={styles.fieldIcon} />
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="Email *"
//                       className={`form-control bg-light border-0 ${styles.iconInput} ${errors.email ? styles.inputInvalid : ""}`}
//                     />
//                   </div>
//                   {errors.email && <div className={styles.errorText}>{errors.email}</div>}
//                 </div>

//                 {/* Location */}
//                 <div className="col-md-12">
//                   <div className={styles.fieldWrap}>
//                     <FaMapMarkerAlt className={styles.fieldIcon} />
//                     <input
//                       type="text"
//                       name="place"
//                       value={formData.place}
//                       onChange={handleInputChange}
//                       placeholder="City / Location *"
//                       className={`form-control bg-light border-0 ${styles.iconInput} ${errors.place ? styles.inputInvalid : ""}`}
//                     />
//                   </div>
//                   {errors.place && <div className={styles.errorText}>{errors.place}</div>}
//                 </div>

//                 {/* Requirements (optional, no icon) */}
//                 <div className="col-md-12">
//                   <textarea
//                     className="form-control p-3 bg-light border-0"
//                     name="query"
//                     value={formData.query}
//                     placeholder="Tell us about your requirements..."
//                     rows="4"
//                     onChange={handleInputChange}
//                     style={{ fontFamily: "inherit" }}
//                   ></textarea>
//                 </div>

//                 {/* Terms */}
//                 <div className="col-12">
//                   <div className={styles.legalRow}>
//                     <input
//                       className={styles.legalCheckbox}
//                       type="checkbox"
//                       checked={formData.termsAccepted}
//                       id="termsAcceptedBottom"
//                       name="termsAccepted"
//                       onChange={handleCheckboxChange}
//                     />
//                     <label className={styles.legalLabel} htmlFor="termsAcceptedBottom">
//                       I agree to the Terms &amp; Conditions
//                     </label>
//                   </div>
//                   {errors.termsAccepted && (
//                     <div className={styles.errorText} style={{ marginTop: "-10px" }}>
//                       {errors.termsAccepted}
//                     </div>
//                   )}
//                 </div>

//                 <div className="col-12 mt-2">
//                   <button
//                     className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm"
//                     type="submit"
//                     style={SUBMIT_BUTTON_STYLE}
//                   >
//                     SEND MESSAGE
//                   </button>
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { FaUser, FaPhoneAlt, FaCheckCircle, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import styles from "./CityForms.module.css";

const SUBMIT_BUTTON_STYLE = {
  background: "linear-gradient(to right, #ff914d, #ff5722)",
  border: "none",
};

// Update these two paths if your legal pages live somewhere else.
const PRIVACY_POLICY_URL = "/privacy-policy";
const TERMS_URL = "/terms-and-conditions";
const CONSENT_ERROR = "Please accept the Privacy Policy and Terms and Conditions to continue.";

function LegalConsent({ id, checked, onChange, error }) {
  return (
    <div className="mb-3">
      <div className={styles.legalRow} style={{ marginBottom: error ? 6 : undefined }}>
        <input
          className={styles.legalCheckbox}
          type="checkbox"
          id={id}
          name="termsAccepted"
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label className={styles.legalLabel} htmlFor={id}>
          I agree to the{" "}
          <Link href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">Privacy Policy</Link>{" "}
          and{" "}
          <Link href={TERMS_URL} target="_blank" rel="noopener noreferrer">Terms and Conditions</Link>.
        </label>
      </div>
      {error && (
        <div id={`${id}-error`} role="alert" className={styles.errorText}>
          {error}
        </div>
      )}
    </div>
  );
}

const isValidMobile = (value) =>
  /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, "").slice(-10));

// 🌟 1. THE SMART SIDEBAR FORM
export function SidebarForm({ city }) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({ fullName: "", contactNo: "", place: "", termsAccepted: false });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ error: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear the error for this field as the user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
    if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Enter your full name";
    if (!formData.contactNo.trim()) newErrors.contactNo = "Enter your mobile number";
    else if (!isValidMobile(formData.contactNo))
      newErrors.contactNo = "Enter a valid 10-digit mobile number";
    if (!formData.place.trim()) newErrors.place = "Enter your location / city";
    if (!formData.termsAccepted) newErrors.termsAccepted = CONSENT_ERROR;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("/user-queries", {
        name: formData.fullName,
        mobile: formData.contactNo,
        email: "", // Maintain consistency with working forms
        // Capture user input location, fallback to page city, or default
        place: formData.place || city || "Not Specified",
        query: "Quick Quote Request from Sidebar",
        ...buildLeadMetadata({
          pathname,
          leadFormType: "sidebar",
          leadFormName: "City Sidebar Form",
          ctaText: "Get Free Estimate",
        }),
      });

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({ fullName: "", contactNo: "", place: "", termsAccepted: false });
      } else {
        setStatus({ error: "Failed to submit. Try again.", message: "" });
      }
    } catch (error) {
      setStatus({ error: "Error submitting form.", message: "" });
    } finally {
      setTimeout(() => setStatus({ error: "", message: "" }), 5000);
    }
  };

  if (submitted) {
    return (
      <div className="sidebar-widget mb-4 bg-white p-5 rounded-4 shadow-sm border text-center animate__animated animate__fadeIn">
        <FaCheckCircle className="text-success mb-3" size={50} />
        <h4 className="fw-bold font-outfit">Thank You!</h4>
        <p className="text-muted small mb-0">
          Our expert team will connect with you shortly to discuss your requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="sidebar-widget mb-4 bg-white p-4 rounded-4 shadow-sm border">
      <h4 className="fw-bold font-outfit mb-4 text-center">Get Free Consultation</h4>
      <form onSubmit={handleSubmit} noValidate>
        {status.error && <div className="alert alert-danger small py-2">{status.error}</div>}

        {/* Full Name */}
        <div className="mb-3">
          <div className={styles.fieldWrap}>
            <FaUser className={styles.fieldIcon} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name *"
              className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.fullName ? styles.inputInvalid : ""}`}
            />
          </div>
          {errors.fullName && <div className={styles.errorText}>{errors.fullName}</div>}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <div className={styles.fieldWrap}>
            <FaPhoneAlt className={styles.fieldIcon} />
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              placeholder="Phone Number *"
              className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.contactNo ? styles.inputInvalid : ""}`}
            />
          </div>
          {errors.contactNo && <div className={styles.errorText}>{errors.contactNo}</div>}
        </div>

        {/* Location */}
        <div className="mb-3">
          <div className={styles.fieldWrap}>
            <FaMapMarkerAlt className={styles.fieldIcon} />
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="Location / City *"
              className={`form-control border-0 bg-light rounded-3 ${styles.iconInput} ${errors.place ? styles.inputInvalid : ""}`}
            />
          </div>
          {errors.place && <div className={styles.errorText}>{errors.place}</div>}
        </div>

        {/* Consent - the form cannot be submitted until this is ticked */}
        <LegalConsent
          id="termsAcceptedSidebar"
          checked={formData.termsAccepted}
          onChange={handleCheckboxChange}
          error={errors.termsAccepted}
        />

        <button
          type="submit"
          className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm"
          style={SUBMIT_BUTTON_STYLE}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

// 🌟 2. THE BOTTOM CONTACT FORM
export function BottomContactForm({ mapSrc }) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    email: "",
    place: "",
    query: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ error: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
    if (errors.termsAccepted) setErrors((prev) => ({ ...prev, termsAccepted: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Enter your full name";
    if (!formData.contactNo.trim()) newErrors.contactNo = "Enter your mobile number";
    else if (!isValidMobile(formData.contactNo))
      newErrors.contactNo = "Enter a valid 10-digit mobile number";
    if (!formData.email.trim()) newErrors.email = "Enter your email address";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      newErrors.email = "Enter a valid email address";
    if (!formData.place.trim()) newErrors.place = "Enter your location / city";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = CONSENT_ERROR;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await api.post("/user-queries", {
        name: formData.fullName,
        mobile: formData.contactNo,
        email: formData.email,
        place: formData.place,
        query: formData.query,
        ...buildLeadMetadata({
          pathname,
          leadFormType: "inline",
          leadFormName: "City Bottom Form",
          ctaText: "SEND MESSAGE",
        }),
      });

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          contactNo: "",
          email: "",
          place: "",
          query: "",
          termsAccepted: false,
        });
      } else {
        setStatus({ error: "Failed to submit. Please try again.", message: "" });
      }
    } catch (error) {
      setStatus({ error: "Error submitting form. Please try again.", message: "" });
    } finally {
      setTimeout(() => setStatus({ error: "", message: "" }), 5000);
    }
  };

  return (
    <div className="premium-card bg-white border-0 mt-5 pt-4">
      <div className="row position-relative mx-0 g-5">
        <div className="col-lg-6 col-12">
          <div
            className="rounded overflow-hidden shadow-sm border"
            style={{ minHeight: "525px", height: "100%" }}
          >
            <iframe
              src={mapSrc || "https://www.google.com/maps/embed?..."}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "525px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="col-lg-6 col-12 d-flex flex-column justify-content-center">
          {submitted ? (
            <div className="text-center p-5 border rounded-4 bg-light animate__animated animate__zoomIn">
              <FaCheckCircle className="text-success mb-4" size={70} />
              <h2 className="font-outfit fw-bold mb-3">Request Received!</h2>
              <p className="text-muted font-poppins fs-5">
                Thank you for reaching out. One of our design experts will contact you shortly to
                discuss your project.
              </p>
              <button
                className="btn btn-outline-dark mt-4 px-4 py-2 fw-bold"
                onClick={() => setSubmitted(false)}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-outfit fw-bold h3 mb-2 text-dark">Reach Out With Confidence</h2>
              <p className="text-muted font-poppins mb-4">
                Fill out the form below and our design experts will contact you shortly.
              </p>
              <form className="row g-3 font-poppins" onSubmit={handleSubmit} noValidate>
                {status.error && (
                  <div className="col-12">
                    <div className="alert alert-danger">{status.error}</div>
                  </div>
                )}

                {/* Full Name */}
                <div className="col-md-6">
                  <div className={styles.fieldWrap}>
                    <FaUser className={styles.fieldIcon} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name *"
                      className={`form-control bg-light border-0 ${styles.iconInput} ${errors.fullName ? styles.inputInvalid : ""}`}
                    />
                  </div>
                  {errors.fullName && <div className={styles.errorText}>{errors.fullName}</div>}
                </div>

                {/* Contact No */}
                <div className="col-md-6">
                  <div className={styles.fieldWrap}>
                    <FaPhoneAlt className={styles.fieldIcon} />
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      placeholder="Contact No. *"
                      className={`form-control bg-light border-0 ${styles.iconInput} ${errors.contactNo ? styles.inputInvalid : ""}`}
                    />
                  </div>
                  {errors.contactNo && <div className={styles.errorText}>{errors.contactNo}</div>}
                </div>

                {/* Email */}
                <div className="col-md-12">
                  <div className={styles.fieldWrap}>
                    <FaEnvelope className={styles.fieldIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      className={`form-control bg-light border-0 ${styles.iconInput} ${errors.email ? styles.inputInvalid : ""}`}
                    />
                  </div>
                  {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                </div>

                {/* Location */}
                <div className="col-md-12">
                  <div className={styles.fieldWrap}>
                    <FaMapMarkerAlt className={styles.fieldIcon} />
                    <input
                      type="text"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      placeholder="City / Location *"
                      className={`form-control bg-light border-0 ${styles.iconInput} ${errors.place ? styles.inputInvalid : ""}`}
                    />
                  </div>
                  {errors.place && <div className={styles.errorText}>{errors.place}</div>}
                </div>

                {/* Requirements (optional, no icon) */}
                <div className="col-md-12">
                  <textarea
                    className="form-control p-3 bg-light border-0"
                    name="query"
                    value={formData.query}
                    placeholder="Tell us about your requirements..."
                    rows="4"
                    onChange={handleInputChange}
                    style={{ fontFamily: "inherit" }}
                  ></textarea>
                </div>

                {/* Terms */}
                <div className="col-12">
                  <LegalConsent
                    id="termsAcceptedBottom"
                    checked={formData.termsAccepted}
                    onChange={handleCheckboxChange}
                    error={errors.termsAccepted}
                  />
                </div>

                <div className="col-12 mt-2">
                  <button
                    className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm"
                    type="submit"
                    style={SUBMIT_BUTTON_STYLE}
                  >
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
