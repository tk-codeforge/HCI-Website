"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { validateLeadField as validateField } from "@/utils/leadValidation";

export default function ContactForm({ mapSrc }) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    place: "",
    query: "",
    termsAndConditions: false,
  });
    const [errors, setErrors] = useState({});

  const [status, setStatus] = useState({ error: "", message: "" });

    const validateForm = () => {
    const newErrors = {};
    ["fullName", "contact", "email", "place", "query", "termsAndConditions"].forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // phone: digits only, drop a pasted +91 / 91 prefix, max 10
    if (name === "contact") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
      value = digits.slice(0, 10);
    }

    if (name === "email") {
    value = value.toLowerCase().replace(/\s/g, "");
}

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const trimmed = value.trim();
    setFormData((prev) => ({ ...prev, [name]: trimmed }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, trimmed) }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, termsAndConditions: checked }));
    setErrors((prev) => ({
      ...prev,
      termsAndConditions: validateField("termsAndConditions", checked),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

        setStatus({ error: "", message: "" });
    if (!validateForm()) return;

    try {
      const response = await api.post("/user-queries", {
        name: formData.fullName.trim(),
        mobile: formData.contact.trim(),
        email: formData.email.trim(),
        place: formData.place.trim(),
        query: formData.query.trim(),
        ...buildLeadMetadata({
          pathname,
          leadFormType: "inline",
          leadFormName: "Home Contact Form",
          ctaText: "SEND",
        }),
      });
      if (response.status === 201) {
        setStatus({ message: "Form submitted successfully!", error: "" });
                setFormData({ fullName: "", contact: "", email: "", place: "", query: "", termsAndConditions: false });
        setErrors({});
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
    <div className="my-5 form">
      <div className="container">
        <div className="row position-relative card_form_row mx-0">
          <div className="col-lg-7 col-md-5 col-12">
            <div className="rounded map pe-lg-5" style={{ minHeight: "525px", height: "100%" }}>
              <iframe 
                src={mapSrc} 
                width="100%" 
                height="100%" 
                title="High Creation Interior Office Location Map"
                style={{ border: 0, minHeight: "525px" }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
              />
            </div>
          </div>
          <div className="col-lg-5 col-md-7 col-12 mt-4 mt-lg-0">
            <div className="contact_form">
              <h4 className="mb-3 text-black form_heading">Reach Out With Confidence</h4>
              <form className="row" onSubmit={handleSubmit} noValidate>
                {status.message && <div className="text-center alert alert-success">{status.message}</div>}
                {status.error && <div className="text-center alert alert-danger">{status.error}</div>}
                

                                <div className="mb-3 col-md-6">
                  <input type="text" className={`form-control ${errors.fullName ? "is-invalid" : ""}`} value={formData.fullName} name="fullName" placeholder="Full Name *" aria-label="Full Name" autoComplete="name" maxLength={60} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3 col-md-6">
                  <input type="tel" inputMode="numeric" className={`form-control ${errors.contact ? "is-invalid" : ""}`} name="contact" value={formData.contact} placeholder="Contact No. (10 Digits) *" aria-label="Contact Number" autoComplete="tel-national" maxLength={10} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.contact && <div className="invalid-feedback">{errors.contact}</div>}
                </div>
                <div className="mb-3 col-md-12">
                  <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} name="email" value={formData.email} placeholder="Email *" aria-label="Email Address" autoComplete="email" maxLength={100} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3 col-md-12">
                  <input type="text" className={`form-control ${errors.place ? "is-invalid" : ""}`} name="place" value={formData.place} placeholder="Place *" aria-label="Place / City" autoComplete="address-level2" maxLength={50} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.place && <div className="invalid-feedback">{errors.place}</div>}
                </div>
                <div className="mb-3 col-md-12">
                  <textarea className={`form-control ${errors.query ? "is-invalid" : ""}`} name="query" value={formData.query} placeholder="Query *" aria-label="Your Query" rows="3" maxLength={500} required onChange={handleInputChange} onBlur={handleInputBlur}></textarea>
                  {errors.query && <div className="invalid-feedback">{errors.query}</div>}
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input className={`form-check-input ${errors.termsAndConditions ? "is-invalid" : ""}`} type="checkbox" checked={formData.termsAndConditions} id="termsAndConditions" name="terms_and_conditions" required onChange={handleCheckboxChange} />
                    <label className="text-black form-check-label" htmlFor="termsAndConditions">Accept Terms & Condition</label>
                    {errors.termsAndConditions && <div className="text-danger small mt-1">{errors.termsAndConditions}</div>}
                  </div>
                </div>
                <div className="m-auto mt-3 col-12 d-flex justify-content-center">
                  <button className="px-5 btn know_more" type="submit">SEND</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}