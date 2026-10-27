"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { FaUser, FaPhoneAlt, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa"; // Added FaMapMarkerAlt
import { validateLeadField as validateField } from "@/utils/leadValidation";

const sanitizePhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  return digits.slice(0, 10);
};

export function SidebarForm({ city }) {
  const pathname = usePathname();
  // Added 'place' to the initial state
  const [formData, setFormData] = useState({ fullName: "", contactNo: "", place: "" });
  const [status, setStatus] = useState({ error: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
    const newErrors = {};
    ["fullName", "contactNo", "place"].forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let value = e.target.value;
if (name === "contactNo") value = sanitizePhone(value);
if (name === "email") value = value.toLowerCase().replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
        setStatus({ error: "", message: "" });
    if (!validateForm()) return;
    try {
      const response = await api.post("/user-queries", {
               name: formData.fullName.trim(),
        mobile: formData.contactNo.trim(),
        email: "",
                place: formData.place.trim(), 
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
        setFormData({ fullName: "", contactNo: "", place: "" }); // Reset place
                setErrors({});
      } else {
        setStatus({ error: "Failed to submit. Try again.", message: "" });
      }
    } catch (error) {
      setStatus({ error: "Error submitting form.", message: "" });
    } finally {
      if (!submitted) {
        setTimeout(() => setStatus({ error: "", message: "" }), 5000);
      }
    }
  };

  if (submitted) {
    return (
      <div className="sidebar-widget mb-4 bg-white p-5 rounded-4 shadow-sm border text-center animate__animated animate__fadeIn">
        <FaCheckCircle className="text-success mb-3" size={50} />
        <h4 className="fw-bold font-outfit">Thank You!</h4>
        <p className="text-muted small mb-0">Our expert team will connect with you shortly to discuss your requirements.</p>
      </div>
    );
  }

  return (
    <div className="sidebar-widget mb-4 bg-white p-4 rounded-4 shadow-sm border">
      <h4 className="fw-bold font-outfit mb-4 text-center">Get Free Consultation</h4>
      
            <form onSubmit={handleSubmit} noValidate>
        {status.error && <div className="alert alert-danger small py-2">{status.error}</div>}

        <div className="mb-3 position-relative">
          <FaUser className="position-absolute text-muted" style={{ top: '16px', left: '15px' }} />
          <input
            type="text"
            className={`form-control bg-light p-3 ps-5 rounded-3 ${errors.fullName ? "border border-danger" : "border-0"}`}
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Full Name *"
            aria-label="Full Name"
            autoComplete="name"
            maxLength={60}
            required
          />
          {errors.fullName && <div className="text-danger small mt-1 ps-1">{errors.fullName}</div>}
        </div>

        <div className="mb-3 position-relative">
          <FaPhoneAlt className="position-absolute text-muted" style={{ top: '16px', left: '15px' }} />
          <input
            type="tel"
            inputMode="numeric"
            className={`form-control bg-light p-3 ps-5 rounded-3 ${errors.contactNo ? "border border-danger" : "border-0"}`}
            name="contactNo"
            value={formData.contactNo}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Phone Number *"
            aria-label="Phone Number"
            autoComplete="tel-national"
            maxLength={10}
            required
          />
          {errors.contactNo && <div className="text-danger small mt-1 ps-1">{errors.contactNo}</div>}
        </div>

        <div className="mb-3 position-relative">
          <FaMapMarkerAlt className="position-absolute text-muted" style={{ top: '16px', left: '15px' }} />
          <input
            type="text"
            className={`form-control bg-light p-3 ps-5 rounded-3 ${errors.place ? "border border-danger" : "border-0"}`}
            name="place"
            value={formData.place}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Location / City *"
            aria-label="Location / City"
            autoComplete="address-level2"
            maxLength={60}
            required
          />
          {errors.place && <div className="text-danger small mt-1 ps-1">{errors.place}</div>}
        </div>

        <button type="submit" className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm" style={{ background: 'linear-gradient(to right, #ff914d, #ff5722)' }}>
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
    fullName: "", contactNo: "", email: "", place: "", query: "", termsAccepted: false,
  });
  const [status, setStatus] = useState({ error: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
    const newErrors = {};
    ["fullName", "contactNo", "email", "place", "query", "termsAccepted"].forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    const value =
      name === "contactNo" ? sanitizePhone(e.target.value) : e.target.value;
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
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
    setErrors((prev) => ({ ...prev, termsAccepted: validateField("termsAccepted", checked) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

        setStatus({ error: "", message: "" });
    if (!validateForm()) return;

    try {
      const response = await api.post("/user-queries", {

                name: formData.fullName.trim(),
        mobile: formData.contactNo.trim(),
        email: formData.email.trim().toLowerCase(),
        place: formData.place.trim(),
        query: formData.query.trim(),
        ...buildLeadMetadata({ 
          pathname, 
          leadFormType: "inline", 
          leadFormName: "City Bottom Form", 
          ctaText: "SEND MESSAGE" 
        }),
      });

      if (response.status === 201) {
        setSubmitted(true);
        setFormData({ fullName: "", contactNo: "", email: "", place: "", query: "", termsAccepted: false });
                setErrors({});
      } else {
        setStatus({ error: "Failed to submit. Please try again.", message: "" });
      }
    } catch (error) {
      setStatus({ error: "Error submitting form. Please try again.", message: "" });
    } finally {
      if (!submitted) {
        setTimeout(() => setStatus({ error: "", message: "" }), 5000);
      }
    }
  };

  return (
    <div className="premium-card bg-white border-0 mt-5 pt-4">
      <div className="row position-relative mx-0 g-5">
        <div className="col-lg-6 col-12">
          <div className="rounded overflow-hidden shadow-sm border" style={{ minHeight: "525px", height: "100%" }}>
            <iframe src={mapSrc || "https://www.google.com/maps/embed?..."} width="100%" height="100%" style={{ border: 0, minHeight: "525px" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
        <div className="col-lg-6 col-12 d-flex flex-column justify-content-center">
          {submitted ? (
            <div className="text-center p-5 border rounded-4 bg-light animate__animated animate__zoomIn">
              <FaCheckCircle className="text-success mb-4" size={70} />
              <h2 className="font-outfit fw-bold mb-3">Request Received!</h2>
              <p className="text-muted font-poppins fs-5">
                Thank you for reaching out. One of our design experts will contact you shortly to discuss your project.
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
              <p className="text-muted font-poppins mb-4">Fill out the form below and our design experts will contact you shortly.</p>
              <form className="row g-3 font-poppins" onSubmit={handleSubmit} noValidate >
                {status.error && <div className="col-12"><div className="alert alert-danger">{status.error}</div></div>}
                
                                <div className="col-md-6">
                  <input type="text" className={`form-control p-3 bg-light ${errors.fullName ? "border border-danger" : "border-0"}`} name="fullName" value={formData.fullName} placeholder="Full Name *" aria-label="Full Name" autoComplete="name" maxLength={60} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
                </div>
                <div className="col-md-6">
                  <input type="tel" inputMode="numeric" className={`form-control p-3 bg-light ${errors.contactNo ? "border border-danger" : "border-0"}`} name="contactNo" value={formData.contactNo} placeholder="Contact No. *" aria-label="Contact Number" autoComplete="tel-national" maxLength={10} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.contactNo && <div className="text-danger small mt-1">{errors.contactNo}</div>}
                </div>
                <div className="col-md-12">
                  <input type="email" className={`form-control p-3 bg-light ${errors.email ? "border border-danger" : "border-0"}`} name="email" value={formData.email} placeholder="Email *" aria-label="Email Address" autoComplete="email" maxLength={100} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>
                <div className="col-md-12">
                  <input type="text" className={`form-control p-3 bg-light ${errors.place ? "border border-danger" : "border-0"}`} name="place" value={formData.place} placeholder="City / Location *" aria-label="City / Location" autoComplete="address-level2" maxLength={60} required onChange={handleInputChange} onBlur={handleInputBlur} />
                  {errors.place && <div className="text-danger small mt-1">{errors.place}</div>}
                </div>
                <div className="col-md-12">
                  <textarea className={`form-control p-3 bg-light ${errors.query ? "border border-danger" : "border-0"}`} name="query" value={formData.query} placeholder="Tell us about your requirements... *" aria-label="Your Requirements" rows="4" maxLength={500} required onChange={handleInputChange} onBlur={handleInputBlur}></textarea>
                  {errors.query && <div className="text-danger small mt-1">{errors.query}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input className={`form-check-input ${errors.termsAccepted ? "is-invalid" : ""}`} type="checkbox" checked={formData.termsAccepted} id="termsAcceptedBottom" name="termsAccepted" required onChange={handleCheckboxChange} />
                    <label className="form-check-label text-muted small" htmlFor="termsAcceptedBottom">I agree to the Terms & Conditions</label>
                    {errors.termsAccepted && <div className="text-danger small mt-1">{errors.termsAccepted}</div>}
                  </div>
                </div>
                <div className="col-12 mt-4">
                  <button className="btn btn-warning w-100 fw-bold text-white py-3 rounded-3 shadow-sm" type="submit" style={{ background: 'linear-gradient(to right, #ff914d, #ff5722)', border: 'none' }}>SEND MESSAGE</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}