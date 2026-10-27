"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import Image from "next/image";
import { FaTimes, FaCheckCircle, FaUser, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import api from "@/utils/api";
import { buildLeadMetadata, getLeadDeviceType, resolveLeadRule } from "@/utils/leadForms";
import { validateLeadField } from "@/utils/leadValidation";

const ContactUsPopUp = ({ onModalStateChange }) => {
    const router = useRouter();
    const pathname = usePathname();
    
    const [showModal, setShowModal] = useState(false);
    const [activeRule, setActiveRule] = useState(null);
    const hasTriggered = useRef(false);
    const lastTriggerType = useRef("time");

    const [loading, setLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState("");
    const [submissionMessage, setSubmissionMessage] = useState("");

    const [formData, setFormData] = useState({
        fullName: "", contact: "", place: "", termsAndConditions: false,
    });

        const [errors, setErrors] = useState({});

    // Same list drives the dropdown and the validation (stops tampered values)
    const locationOptions = activeRule?.locations
        ? activeRule.locations.split(",").map((l) => l.trim()).filter(Boolean)
        : ["Noida", "Delhi", "Gurgaon", "Faridabad", "Ghaziabad"];


        const validateField = (name, value) => {
        if (name === "place") {
            if (!value) return "Please select your location.";
            return locationOptions.includes(value) ? "" : "Please select a valid location.";
        }
        return validateLeadField(name, value); // fullName, contact, termsAndConditions
    };

    const validateForm = () => {
        const newErrors = {};
        ["fullName", "contact", "place", "termsAndConditions"].forEach((f) => {
            const err = validateField(f, formData[f]);
            if (err) newErrors[f] = err;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name } = e.target;
        let { value } = e.target;

        if (name === "contact") {
            let digits = value.replace(/\D/g, "");
            if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
            value = digits.slice(0, 10);
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
        setErrors((prev) => ({ ...prev, termsAndConditions: validateField("termsAndConditions", checked) }));
    };

    const handleClose = () => {
        setShowModal(false);
        // sessionStorage.setItem("offerPopupSeen", "true");
         sessionStorage.setItem(`offerPopupSeen:${pathname}`, "true");
        if (onModalStateChange) onModalStateChange(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError("");


        if (!validateForm()) return;
        setLoading(true);

        const formRequestData = {
            name: formData.fullName.trim(),
            mobile: formData.contact.trim(),
            place: formData.place.trim(),
            email: "", 
            // query: `Offer Claimed. Pincode/Location: ${formData.place}`, 
            query: "", 
            ...buildLeadMetadata({
                pathname,
                leadFormType: "popup",
                rule: activeRule,
                leadFormName: activeRule?.lead_form_name || `Modern Popup ${pathname || "/"}`,
                triggerType: lastTriggerType.current || activeRule?.trigger_type || "time",
                ctaText: activeRule?.cta_text || "SEND",
                deviceType: getLeadDeviceType(),
            }),
        };

        try {
            const response = await api.post("/user-queries", formRequestData);
            if (response.status === 201) {
                setSubmissionMessage(activeRule?.success_message || "Details submitted successfully!");
                setFormData({ fullName: "", contact: "", place: "", termsAndConditions: false });
                                setErrors({});

                setTimeout(() => {
                    handleClose();
                    const redirectUrl = activeRule?.redirect_url || "/thank-you";
                    if (!redirectUrl) return;

                    if (/^https?:\/\//i.test(redirectUrl)) {
                        window.location.href = redirectUrl;
                    } else {
                        router.push(redirectUrl);
                    }
                }, 1500);
            } else {
                setSubmissionError("Submission failed. Please try again.");
            }
        } catch (error) {
            setSubmissionError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSubmissionError("");
                setSubmissionMessage("");
            }, 5000);
        }
    };

    useEffect(() => {
        hasTriggered.current = false;
        lastTriggerType.current = "time";
        setShowModal(false);
        setActiveRule(null);
        if (onModalStateChange) onModalStateChange(false);
        let timerId;
        let scrollListener;
        let exitListener;

        const fetchAndApplyRules = async () => {
            try {
                const ruleToApply = await resolveLeadRule(pathname);

                if (!ruleToApply || !ruleToApply.is_enabled) return; 

                const isMobile = getLeadDeviceType() === "mobile";
                if (isMobile && !ruleToApply.show_mobile) return; 
                if (!isMobile && !ruleToApply.show_desktop) return; 

                setActiveRule(ruleToApply);

                const triggerPopup = (triggerSource = "time") => {
                    // if (!hasTriggered.current && !sessionStorage.getItem("offerPopupSeen")) {
                    if (!hasTriggered.current && !sessionStorage.getItem(`offerPopupSeen:${pathname}`)) {
                        hasTriggered.current = true;
                        lastTriggerType.current = triggerSource;
                        setShowModal(true);
                        if (onModalStateChange) onModalStateChange(true);
                    }
                };

                const triggerType = ruleToApply.trigger_type || 'time';

                if (triggerType === 'time') {
                    const delay = (ruleToApply.delay_seconds ?? 6) * 1000; 
                    timerId = setTimeout(() => triggerPopup('time'), delay);
                } 
                else if (triggerType === 'scroll') {
                    scrollListener = () => {
                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                        if (maxScroll <= 0) return; 
                        
                        const scrollPercent = (window.scrollY / maxScroll) * 100;
                        if (scrollPercent >= (ruleToApply.scroll_percentage || 50)) {
                            triggerPopup('scroll');
                            window.removeEventListener("scroll", scrollListener);
                        }
                    };
                    window.addEventListener("scroll", scrollListener);
                } 
                else if (triggerType === 'exit') {
                    if (isMobile) {
                        const delay = (ruleToApply.delay_seconds ?? 6) * 1000;
                        timerId = setTimeout(() => triggerPopup('exit-mobile-fallback'), delay);
                    } else {
                        exitListener = (e) => {
                            if (e.clientY <= 0) { 
                                triggerPopup('exit');
                                document.removeEventListener("mouseleave", exitListener);
                            }
                        };
                        document.addEventListener("mouseleave", exitListener);
                    }
                }
            } catch (error) {
                console.error("Failed to load CMS popup rules.");
            }
        };

        fetchAndApplyRules();

        return () => {
            if (timerId) clearTimeout(timerId);
            if (scrollListener) window.removeEventListener("scroll", scrollListener);
            if (exitListener) document.removeEventListener("mouseleave", exitListener);
        };
    }, [pathname, onModalStateChange]);

    if (!showModal) return null;

    // Detect if images exist
    const hasDesktopImage = Boolean(activeRule?.desktop_image);
    const hasMobileImage = Boolean(activeRule?.mobile_image);
    
    // Assign modal container class dynamically based on desktop image presence
    const modalClass = hasDesktopImage ? 'with-desktop-image' : 'without-desktop-image';

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                .hc-modern-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
                    background: rgba(0, 0, 0, 0.5); 
                    z-index: 999999; display: flex; align-items: center; justify-content: center;
                    animation: hcFadeIn 0.3s ease-out;
                }
                .hc-modern-modal {
                    background: #ffffff; border-radius: 20px; width: 92%; 
                    display: flex; overflow: hidden; position: relative;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.25);
                    animation: hcSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                /* DESKTOP LAYOUT */
                .hc-modern-modal.with-desktop-image {
                    max-width: 850px; flex-direction: row;
                }
                .hc-modern-modal.without-desktop-image {
                    max-width: 450px; flex-direction: column;
                }
                .desktop-banner-side { flex: 1; position: relative; min-height: 480px; background: #f8fafc; }
                
                /* MOBILE LAYOUT */
                .mobile-banner-side { display: none; width: 100%; height: 180px; position: relative; background: #f8fafc; }
                
                .hc-form-side {
                    flex: 1; padding: 45px 40px; display: flex; flex-direction: column; justify-content: center;
                }

                @media (max-width: 768px) {
                    /* On Mobile, force modal to be a column */
                    .hc-modern-modal.with-desktop-image, 
                    .hc-modern-modal.without-desktop-image { 
                        flex-direction: column; max-width: 450px; 
                    }
                    .hc-form-side { padding: 30px 25px; }
                    
                    /* Hide Desktop image, Show Mobile image */
                    .desktop-banner-side { display: none; }
                    .mobile-banner-side { display: block; }
                }

                .hc-close-btn {
                    position: absolute; top: 15px; right: 15px; z-index: 10;
                    width: 36px; height: 36px; background: rgba(255,255,255,0.9);
                    border: none; border-radius: 50%; display: flex;
                    align-items: center; justify-content: center;
                    color: #333; cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .hc-close-btn:hover { background: #ff914d; color: white; transform: rotate(90deg); }
                
                .hc-modal-title {
                    font-family: var(--font-outfit), sans-serif; font-size: 26px;
                    font-weight: 800; color: #0f172a; margin-bottom: 8px; line-height: 1.2;
                }
                .hc-modal-subtitle {
                    font-family: var(--font-poppins), sans-serif; font-size: 14px;
                    color: #64748b; margin-bottom: 25px;
                }
                .hc-input-wrap { position: relative; margin-bottom: 16px; }
                .hc-input-icon {
                    position: absolute; top: 50%; left: 16px; transform: translateY(-50%);
                    color: #94a3b8; font-size: 15px; z-index: 2;
                }
                .hc-input {
                    width: 100%; padding: 14px 16px 14px 45px;
                    border: 1px solid #e2e8f0; border-radius: 12px;
                    background: #f8fafc; font-family: var(--font-poppins), sans-serif;
                    font-size: 14px; color: #334155; transition: all 0.3s;
                }
                .hc-input:focus {
                    outline: none; border-color: #ff914d; background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(255,145,77,0.1);
                }

                                .hc-input-invalid { border-color: #dc3545 !important; background: #fff5f5; }
                .hc-error {
                    color: #dc3545; font-size: 12px; margin: -10px 0 14px 4px;
                    font-family: var(--font-poppins), sans-serif;
                }

                .hc-checkbox-wrap { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 25px; }
                .hc-checkbox-text { font-size: 12px; color: #64748b; line-height: 1.5; margin: 0; font-family: var(--font-poppins), sans-serif; }
                .hc-checkbox-text a { color: #ff914d; text-decoration: none; font-weight: 600; }

                .hc-submit-btn {
                    width: 100%; padding: 15px; border: none; border-radius: 12px;
                    background: linear-gradient(135deg, #ff914d 0%, #e67d3e 100%);
                    color: white; font-family: var(--font-outfit), sans-serif;
                    font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s;
                }
                .hc-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(255,145,77,0.35); }
                .hc-submit-btn:disabled { opacity: 0.7; transform: none; cursor: not-allowed; }

                @keyframes hcFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes hcSlideUp { from { transform: translateY(40px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            `}} />

            <div className="hc-modern-overlay">
                <div className={`hc-modern-modal ${modalClass}`}>
                    
                    <button onClick={handleClose} className="hc-close-btn" aria-label="Close">
                        <FaTimes size={14} />
                    </button>

                    {/* Desktop Image Side (Hidden on Mobile) */}
                    {hasDesktopImage && (
                        <div className="desktop-banner-side">
                            <Image src={activeRule.desktop_image} alt="Offer" fill style={{ objectFit: "cover" }} priority />
                        </div>
                    )}

                    {/* Mobile Image Top Banner (Hidden on Desktop) */}
                    {hasMobileImage && (
                        <div className="mobile-banner-side">
                            <Image src={activeRule.mobile_image} alt="Offer" fill style={{ objectFit: "cover" }} priority />
                        </div>
                    )}

                    {/* Form Side */}
                    <div className="hc-form-side">
                        {submissionMessage ? (
                            <div className="text-center py-4 animate__animated animate__zoomIn">
                                <FaCheckCircle color="#22c55e" className="mb-3" size={64} />
                                <h3 className="hc-modal-title">Request Received!</h3>
                                <p className="hc-modal-subtitle">{submissionMessage}</p>
                            </div>
                        ) : (
                            <>
                                <h3 className={`hc-modal-title ${!hasDesktopImage ? 'text-center' : ''}`}>
                                    {activeRule?.heading || "Let's build your dream space."}
                                </h3>
                                {activeRule?.sub_heading && (
                                    <p className={`hc-modal-subtitle ${!hasDesktopImage ? 'text-center' : ''}`}>
                                        {activeRule.sub_heading}
                                    </p>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    {submissionError && <div className="alert alert-danger p-2 small mb-3 text-center rounded-3">{submissionError}</div>}

                                                                        {/* Full Name */}
                                    <div className="hc-input-wrap">
                                        <FaUser className="hc-input-icon" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            className={`hc-input ${errors.fullName ? "hc-input-invalid" : ""}`}
                                            placeholder="Full Name *"
                                            aria-label="Full Name"
                                            autoComplete="name"
                                            maxLength={60}
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            required
                                        />
                                    </div>
                                    {errors.fullName && <p className="hc-error">{errors.fullName}</p>}

                                    {/* Phone */}
                                    <div className="hc-input-wrap">
                                        <FaPhoneAlt className="hc-input-icon" />
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            name="contact"
                                            className={`hc-input ${errors.contact ? "hc-input-invalid" : ""}`}
                                            placeholder="Phone Number (10 Digits) *"
                                            aria-label="Phone Number"
                                            autoComplete="tel-national"
                                            maxLength={10}
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            required
                                        />
                                    </div>
                                    {errors.contact && <p className="hc-error">{errors.contact}</p>}

                                    {/* Location (CMS-managed dropdown) */}
                                    <div className="hc-input-wrap">
                                        <FaMapMarkerAlt className="hc-input-icon" />
                                        <select
                                            name="place"
                                            className={`hc-input ${errors.place ? "hc-input-invalid" : ""}`}
                                            aria-label="Location"
                                            value={formData.place}
                                            onChange={handleInputChange}
                                            onBlur={handleInputBlur}
                                            style={{ appearance: 'none', cursor: 'pointer' }}
                                            required
                                        >
                                            <option value="">Select Location *</option>
                                            {locationOptions.map((loc) => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.place && <p className="hc-error">{errors.place}</p>}

                                    <div className="hc-checkbox-wrap">
                                        <input 
                                            type="checkbox" 
                                            id="termsCheck" 
                                            className="mt-1"
                                            style={{ accentColor: '#ff914d', cursor: 'pointer' }}
                                            checked={formData.termsAndConditions}
                                            onChange={handleCheckboxChange}
                                            required
                                        />
                                        <label htmlFor="termsCheck" className="hc-checkbox-text" style={{ cursor: 'pointer' }}>
                                            I agree to the <a href="/term-and-condition">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
                                        </label>
                                    </div>
                                    {errors.termsAndConditions && (
                                        <p className="hc-error" style={{ marginTop: "-18px", marginBottom: "18px" }}>
                                            {errors.termsAndConditions}
                                        </p>
                                    )}

                                    <button type="submit" className="hc-submit-btn" disabled={loading}>
                                        {loading ? "PROCESSING..." : activeRule?.cta_text || "GET FREE QUOTE"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPopUp;