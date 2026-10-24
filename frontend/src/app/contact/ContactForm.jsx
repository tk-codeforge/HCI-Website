// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";

// const ContactForm = () => {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     contactNo: "",
//     email: "",
//     place: "",
//     query: "",
//     termsAccepted: false,
//   });

//   // State to handle errors and success messages
//   const [submissionError, setSubmissionError] = useState("");
//   const [submissionMessage, setSubmissionMessage] = useState("");

//   // Handle input change for text fields
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   // Handle checkbox change
//   const handleCheckboxChange = (e) => {
//     const { checked } = e.target;
//     setFormData((prevData) => ({ ...prevData, termsAccepted: checked }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if terms are accepted
//     if (!formData.termsAccepted) {
//       setSubmissionError(
//         "You must agree to the Terms & Conditions before submitting."
//       );
//       return;
//     }

//     const formRequestData = {
//       name: formData.fullName,
//       mobile: formData.contactNo,
//       email: formData.email,
//       place: formData.place,
//       query: formData.query,
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Contact Page Lead Form",
//         ctaText: "SEND",
//       }),
//     };

//     try {
//       // Send POST request to save form data
//       const response = await api.post("/user-queries", formRequestData);

//       // Handle success response
//       if (response.status === 201) {
//         setSubmissionMessage("Form submitted successfully!");
//         setFormData({
//           fullName: "",
//           contactNo: "",
//           email: "",
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
//       console.error("Error:", error);
//     } finally {
//       // Clear error message after some time
//       setTimeout(() => {
//         setSubmissionError("");
//         setSubmissionMessage("");
//       }, 5000);
//     }
//   };

//   return (
//     <>
//       <div className="contact_form contact">
//         <h4 className="mb-3 text-black form_heading">Let’s Connect</h4>
//         <form className="row" onSubmit={handleSubmit}>
//           {submissionMessage && (
//             <div className="text-center alert alert-success alert-dismissible fade show">
//               {submissionMessage}
//             </div>
//           )}
//           {submissionError && (
//             <div className="text-center alert alert-danger alert-dismissible fade show">
//               {submissionError}
//             </div>
//           )}

//           <div className="mb-3 col-md-6">
//             <input
//               type="text"
//               className="form-control"
//               name="fullName"
//               placeholder="Full Name"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3 col-md-6">
//             <input
//               type="text"
//               className="form-control"
//               name="contactNo"
//               placeholder="Contact No."
//               value={formData.contactNo}
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           <div className="mb-3 col-md-12">
//             <input
//               type="email"
//               className="form-control"
//               name="email"
//               placeholder="Email"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="mb-3 col-md-12">
//             <input
//               type="text"
//               className="form-control"
//               name="place"
//               value={formData.place}
//               onChange={handleInputChange}
//               placeholder="Place"
//               required
//             />
//           </div>

//           <div className="mb-3 col-md-12">
//             <textarea
//               className="form-control"
//               name="query"
//               placeholder="Query"
//               rows="3"
//               value={formData.query}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-12">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="invalidCheck"
//                 checked={formData.termsAccepted}
//                 onChange={handleCheckboxChange}
//                 required
//               />
//               <label
//                 className="text-black form-check-label"
//                 htmlFor="invalidCheck"
//               >
//                 Accept Terms & Conditions
//               </label>
//               <div className="text-black invalid-feedback">
//                 You must agree before submitting.
//               </div>
//             </div>
//           </div>

//           <div className="m-auto mt-3 col-12 d-flex justify-content-center">
//             <button className="px-5 know_more" type="submit">
//               SEND
//             </button>
//           </div>
//         </form>
//       </div>
//       {/* Applying global styles here to ensure they load on client */}
//       <style jsx global>{`
//         .contact_wrapper p {
//           font-size: 16px;
//         }
//       `}</style>
//     </>
//   );
// };

// export default ContactForm;


"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { validateLeadField as validateField } from "@/utils/leadValidation";

const ContactForm = ({ mapSrc }) => {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    email: "",
    place: "",
    query: "",
    termsAccepted: false,
  });

  const [submissionError, setSubmissionError] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
    const [errors, setErrors] = useState({});

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // const handleCheckboxChange = (e) => {
  //   const { checked } = e.target;
  //   setFormData((prevData) => ({ ...prevData, termsAccepted: checked }));
  // };

  //   const validateField = (name, rawValue) => {
  //   const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
  //   switch (name) {
  //     case "fullName":
  //       if (!value) return "Full name is required.";
  //       if (value.length < 2) return "Full name must be at least 2 characters.";
  //       if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(value))
  //         return "Full name can only contain letters and spaces.";
  //       return "";
  //     case "contactNo":
  //       if (!value) return "Contact number is required.";
  //       if (!/^\d{10}$/.test(value))
  //         return "Enter a valid 10-digit contact number.";
  //       if (!/^[6-9]/.test(value))
  //         return "Contact number must start with 6, 7, 8 or 9.";
  //       return "";
  //     case "email":
  //       if (!value) return "Email is required.";
  //       if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
  //         return "Enter a valid email address.";
  //       return "";
  //     case "place":
  //       if (!value) return "Place is required.";
  //       if (value.length < 2) return "Enter a valid place.";
  //       return "";
  //     case "query":
  //       if (!value) return "Query is required.";
  //       if (value.length < 10) return "Query must be at least 10 characters.";
  //       return "";
  //     case "termsAccepted":
  //       return value ? "" : "You must accept the Terms & Conditions.";
  //     default:
  //       return "";
  //   }
  // };

  const validateForm = () => {
    const fields = [
      "fullName",
      "contactNo",
      "email",
      "place",
      "query",
      "termsAccepted",
    ];
    const newErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // contact no: digits only, drop +91 / 91 prefix on paste, max 10
    if (name === "contactNo") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
      value = digits.slice(0, 10);
    }

    if (name === "email") {
  value = value.toLowerCase().replace(/\s/g, "");
}

    setFormData((prev) => ({ ...prev, [name]: value }));

    // once a field has been validated, keep its error live while typing
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const trimmed = name === "email" ? value.trim().toLowerCase() : value.trim();
    setFormData((prev) => ({ ...prev, [name]: trimmed }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, trimmed) }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
    setErrors((prev) => ({
      ...prev,
      termsAccepted: validateField("termsAccepted", checked),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!formData.termsAccepted) {
    //   setSubmissionError(
    //     "You must agree to the Terms & Conditions before submitting."
    //   );
    //   return;
    // }

        setSubmissionError("");
    if (!validateForm()) return;

    const formRequestData = {
      // name: formData.fullName,
      // mobile: formData.contactNo,
      // email: formData.email,
      // place: formData.place,
      // query: formData.query,
            name: formData.fullName.trim(),
      mobile: formData.contactNo.trim(),
      email: formData.email.trim().toLowerCase(),
      place: formData.place.trim(),
      query: formData.query.trim(),
      ...buildLeadMetadata({
        pathname,
        leadFormType: "inline",
        leadFormName: "Contact Page Lead Form",
        ctaText: "SEND",
      }),
    };

    try {
      const response = await api.post("/user-queries", formRequestData);

      if (response.status === 201) {
        setSubmissionMessage("Form submitted successfully!");
        setFormData({
          fullName: "",
          contactNo: "",
          email: "",
          place: "",
          query: "",
          termsAccepted: false,
        });
        // Increased timeout from 300ms to 1500ms so users can read the success message
                setErrors({});
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 1500);
      } else {
        setSubmissionError("Failed to submit form. Please try again.");
      }
    } catch (error) {
      setSubmissionError("Error submitting form. Please try again.");
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
        setSubmissionError("");
        setSubmissionMessage("");
      }, 5000);
    }
  };

  return (
    <>
      <div className="contact_form contact">
        <h4 className="mb-3 text-black form_heading">Let’s Connect</h4>
        <form className="row" onSubmit={handleSubmit} noValidate >
          {submissionMessage && (
            <div className="text-center alert alert-success alert-dismissible fade show" role="alert">
              {submissionMessage}
            </div>
          )}
          {submissionError && (
            <div className="text-center alert alert-danger alert-dismissible fade show" role="alert">
              {submissionError}
            </div>
          )}

          {/* <div className="mb-3 col-md-6">
            <input
              type="text"
              className="form-control"
              name="fullName"
              placeholder="Full Name"
              aria-label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 col-md-6">
            <input
              type="text"
              className="form-control"
              name="contactNo"
              placeholder="Contact No."
              aria-label="Contact Number"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3 col-md-12">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              aria-label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3 col-md-12">
            <input
              type="text"
              className="form-control"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="Place"
              aria-label="Place / City"
              required
            />
          </div>

          <div className="mb-3 col-md-12">
            <textarea
              className="form-control"
              name="query"
              placeholder="Query"
              aria-label="Your Query"
              rows="3"
              value={formData.query}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="invalidCheck"
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                required
              />
              <label
                className="text-black form-check-label"
                htmlFor="invalidCheck"
              >
                Accept Terms & Conditions
              </label>
              <div className="text-black invalid-feedback">
                You must agree before submitting.
              </div>
            </div>
          </div> */}

                    <div className="mb-3 col-md-6">
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              name="fullName"
              placeholder="Full Name *"
              aria-label="Full Name"
              autoComplete="name"
              maxLength={60}
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>
          <div className="mb-3 col-md-6">
            <input
              type="tel"
              inputMode="numeric"
              className={`form-control ${errors.contactNo ? "is-invalid" : ""}`}
              name="contactNo"
              placeholder="Contact No. *"
              aria-label="Contact Number"
              autoComplete="tel-national"
              maxLength={10}
              value={formData.contactNo}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.contactNo && (
              <div className="invalid-feedback">{errors.contactNo}</div>
            )}
          </div>

          <div className="mb-3 col-md-12">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              placeholder="Email *"
              aria-label="Email Address"
              autoComplete="email"
              maxLength={100}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3 col-md-12">
            <input
              type="text"
              className={`form-control ${errors.place ? "is-invalid" : ""}`}
              name="place"
              placeholder="Place *"
              aria-label="Place / City"
              autoComplete="address-level2"
              maxLength={60}
              value={formData.place}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.place && (
              <div className="invalid-feedback">{errors.place}</div>
            )}
          </div>

          <div className="mb-3 col-md-12">
            <textarea
              className={`form-control ${errors.query ? "is-invalid" : ""}`}
              name="query"
              placeholder="Query *"
              aria-label="Your Query"
              rows="3"
              maxLength={500}
              value={formData.query}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            ></textarea>
            {errors.query && (
              <div className="invalid-feedback">{errors.query}</div>
            )}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className={`form-check-input ${
                  errors.termsAccepted ? "is-invalid" : ""
                }`}
                type="checkbox"
                id="invalidCheck"
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                required
              />
              <label
                className="text-black form-check-label"
                htmlFor="invalidCheck"
              >
                Accept Terms & Conditions
              </label>
              {errors.termsAccepted && (
                <div className="text-danger small mt-1">
                  {errors.termsAccepted}
                </div>
              )}
            </div>
          </div>

          <div className="m-auto mt-3 col-12 d-flex justify-content-center">
            <button className="px-5 know_more btn" type="submit">
              SEND
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .contact_wrapper p {
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

export default ContactForm;