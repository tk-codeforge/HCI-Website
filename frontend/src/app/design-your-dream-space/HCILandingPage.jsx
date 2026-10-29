"use client";

import { Children, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { validateLeadField } from "@/utils/leadValidation";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";

// WhatsApp enquiries + the phone link in the final call-to-action.
const CONTACT_NUMBER = "919810506301";
const CONTACT_DISPLAY = "+91 98105 06301";
// The estimator copy that lives inside this landing-page folder (app/design-your-dream-space/estimator-for-home).
// A relative path keeps working on localhost, stage2.hcinterior.in and production.
const ESTIMATOR_PATH = "/design-your-dream-space/estimator-for-home";
// Number used by the "Call" buttons and the floating call button.
const CALL_NUMBER = "917070701373";
const CALL_DISPLAY = "+91 70707 01373";
const WHATSAPP_GREETING = "Hello HC Interior, I would like to discuss an interior design enquiry.";

const whatsappUrl = (message) => `https://wa.me/${CONTACT_NUMBER}?text=${encodeURIComponent(message)}`;

const images = {
  // Published HC Interior Luxury Projects / Ready To Go Design gallery assets.
  hero: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618437357-424701680.png",
  planning: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
  custom: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618439213-81831281.png",
  furniture: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779626359913-930967107.png",
  kitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
  living: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624540042-958249945.jpg",
  bedroom: "https://apidev.hcinterior.in/uploads/parent-child/image-1742645786915-419668135.jpg",
  storage: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779626359913-930967107.png",
  details: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779874067164-110566752.png",
  dining: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618591342-113150251.png",
  office: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779873122703-876609311.png",
  luxuryKitchen: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779619195690-775248541.png",
  readyLiving: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
  readyKitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
  readyBedroom: "https://apidev.hcinterior.in/uploads/parent-child/image-1742645786915-419668135.jpg",
  readyBalcony: "https://apidev.hcinterior.in/uploads/parent-child/image-1737288595592-330954825.jpg",
};

// Lines typed out in the hero headline, one after another.
const heroPhrases = [
  "Complete customization for every corner of your home.",
  "In-house production, crafted with care.",
  "Free design consultation to plan your next step.",
  "A better home starts with a clear plan.",
];

const heroPoints = ["Free design consultation", "Complete customization", "In-house production"];

const services = [
  {
    number: "01",
    title: "Interior Design & Planning",
    text: "Layouts, design concepts and material choices shaped around your space, preferences and everyday routine.",
    image: images.planning,
  },
  {
    number: "02",
    title: "Custom Interior Design",
    text: "Personalised interiors and made-for-you solutions that bring style, comfort and functionality together.",
    image: images.custom,
  },
  {
    number: "03",
    title: "Furniture & Décor",
    text: "Furniture, finishes and thoughtful details selected to complement the character of your home.",
    image: images.furniture,
  },
  {
    number: "04",
    title: "Kitchen Interior Design",
    text: "Practical, well-planned kitchens designed around storage, workflow and the way you cook.",
    image: images.kitchen,
  },
];

const roomIdeas = [
  {
    title: "Kitchen",
    label: "Premium modular kitchen",
    image: images.luxuryKitchen,
  },
  {
    title: "Living Room",
    label: "Considered luxury living",
    image: images.hero,
  },
  {
    title: "Master Bedroom",
    label: "A restful premium retreat",
    image: images.details,
  },
  {
    title: "Wardrobe & Storage",
    label: "Bespoke wardrobe details",
    image: images.furniture,
  },
];

// "Every room should earn its place" – each point swaps the photo on the left.
const storyPoints = [
  {
    key: "layouts",
    short: "Layouts",
    icon: "layers",
    title: "Layouts informed by your space and routines",
    text: "Movement, storage and furniture placement are planned around how each room is actually used day to day.",
    image: images.living,
    alt: "Living room layout with comfortable seating, natural light and warm finishes",
  },
  {
    key: "finishes",
    short: "Finishes",
    icon: "palette",
    title: "Finishes and furniture chosen with intention",
    text: "Materials, textures and furniture are selected together so the room feels cohesive rather than assembled.",
    image: images.furniture,
    alt: "Wardrobe and storage interior with warm wood finishes and layered lighting",
  },
  {
    key: "decisions",
    short: "Decisions",
    icon: "person",
    title: "Design decisions discussed along the way",
    text: "You stay part of the conversation as the concept, layout and details take shape.",
    image: images.details,
    alt: "Warm modern bedroom interior with wood, stone and layered lighting",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Initial consultation",
    text: "We understand your preferences, requirements, space and vision.",
  },
  {
    number: "02",
    title: "Creative concept",
    text: "We shape a design direction that reflects your style and needs.",
  },
  {
    number: "03",
    title: "Design strategy",
    text: "Layouts, materials and design details are brought into a clear plan.",
  },
  {
    number: "04",
    title: "Execution planning",
    text: "We prepare the details required to move the approved design forward.",
  },
  {
    number: "05",
    title: "Final handover",
    text: "The completed space is reviewed and handed over with care.",
  },
];

const inspirationCards = [
  {
    title: "Warm, natural living",
    category: "Ready-to-go living",
    image: images.readyLiving,
  },
  {
    title: "A kitchen made practical",
    category: "Modular kitchen",
    image: images.readyKitchen,
  },
  {
    title: "Quiet bedroom details",
    category: "Master bedroom",
    image: images.readyBedroom,
  },
  {
    title: "A slower outdoor escape",
    category: "Balcony design",
    image: images.readyBalcony,
  },
];

const faqs = [
  {
    question: "What interior design services does HC Interior offer?",
    answer:
      "HC Interior offers interior design and planning, custom interior solutions, furniture and décor, and kitchen interior design. The right combination depends on your space and requirements.",
  },
  {
    question: "Can the design be personalised to my home and style?",
    answer:
      "Yes. The design process starts by understanding your preferences, lifestyle and space requirements, then develops a concept and plan around them.",
  },
  {
    question: "How does the interior design process work?",
    answer:
      "The published process covers an initial consultation, creative concept, design strategy, execution planning and final handover. Site visits, measurements, design presentation and quotation are discussed as the project develops.",
  },
  {
    question: "Which areas does HC Interior serve?",
    answer:
      "HC Interior lists service areas across Delhi NCR, including Delhi, Noida, Noida Extension, Greater Noida, Ghaziabad, Gurugram, Faridabad, Dwarka, Manesar and Sohna. Contact the team to confirm support for your specific location.",
  },
];

const experienceCenters = [
  {
    city: "Noida",
    address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301",
    phone: "+91 70707 01373",
    telephone: "+917070701373",
  },
  {
    city: "Noida Extension",
    address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
    phone: "+91 70707 01373",
    telephone: "+917070701373",
  },
  {
    city: "Gurugram",
    address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
    phone: "+91 70707 01373",
    telephone: "+917070701373",
  },
  {
    city: "Faridabad",
    address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Faridabad, Haryana 121002",
    phone: "+91 70707 01373",
    telephone: "+917070701373",
  },
];

const locations = [
  "New Delhi",
  "Noida",
  "Noida Extension",
  "Greater Noida",
  "Ghaziabad",
  "Gurugram",
  "Faridabad",
  "Dwarka",
  "Manesar",
  "Sohna",
];

const serviceAreas = [
  { city: "Noida" },
  { city: "Ghaziabad" },
  { city: "Greater Noida" },
  { city: "Noida Extension" },
  { city: "Delhi" },
  { city: "Dwarka" },
  { city: "Gurugram" },
  { city: "Manesar" },
  { city: "Sohna" },
  { city: "Faridabad" },
];

// Mobile slider shows the serving areas four at a time (2 x 2); desktop keeps the normal two-column grid.
const locationGroups = [];
for (let i = 0; i < serviceAreas.length; i += 4) locationGroups.push(serviceAreas.slice(i, i + 4));

function Icon({ name, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "whatsapp") {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

  const shapes = {
    person: (
      <>
        <circle cx="12" cy="7.5" r="3.2" />
        <path d="M5.5 20v-1.3a6.5 6.5 0 0 1 13 0V20" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 1.6-4 1.8 1.8 0 0 1 1.3-3.1H18A3 3 0 0 0 21 11C21 6.6 17 3 12 3Z" />
        <circle cx="7.7" cy="10" r=".8" />
        <circle cx="10.5" cy="6.9" r=".8" />
        <circle cx="15" cy="7.5" r=".8" />
      </>
    ),
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
    phone: (
      <>
        <path d="M7 3h10v18H7z" />
        <path d="M10 6h4M11 18h2" />
      </>
    ),
    "phone-call": (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.2 18.8a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4.09 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.07 9.93a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />
      </>
    ),
    chat: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.3A8.4 8.4 0 1 1 21 11.5Z" />
        <path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.3-1.3-1.9-1-.8.7a3.3 3.3 0 0 1-1.6-1.6l.7-.8-1-1.9L9 9.5Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    sparkle: (
      <>
        <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </>
    ),
  };

  return <svg {...common}>{shapes[name] || shapes.sparkle}</svg>;
}

/* Types the given phrases one after another (type, hold, delete, next).
   With "reduce motion" enabled the first phrase is simply shown in full. */
function useTypewriter(phrases) {
  const [text, setText] = useState("");

  useEffect(() => {
    const reduceMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setText(phrases[0]);
      return undefined;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        setText(current.slice(0, charIndex));
        if (charIndex === current.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
        timer = setTimeout(tick, 52);
        return;
      }

      charIndex -= 1;
      setText(current.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        timer = setTimeout(tick, 380);
        return;
      }
      timer = setTimeout(tick, 24);
    };

    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

/* Call + WhatsApp buttons used in the hero (the form is already beside them). */
function CtaRow({ className = "", extra = null }) {
  return (
    <div className={`hci-cta-row ${className}`.trim()}>
      {extra}
      <a className="hci-button hci-button-primary" href={`tel:+${CALL_NUMBER}`}>Call {CALL_DISPLAY}</a>
      <a
        className="hci-button hci-button-primary"
        href={whatsappUrl(WHATSAPP_GREETING)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}

/* Card that leans towards the pointer and follows it with a soft highlight. */
function TiltCard({ className = "", children, ...props }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${((x - 0.5) * 11).toFixed(2)}deg`);
    node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
    node.style.setProperty("--mx", "50%");
    node.style.setProperty("--my", "50%");
  };

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} {...props}>
      {children}
    </div>
  );
}

/*
 * Native, finger-friendly horizontal slider used only by the mobile layout.
 * The content remains a normal grid on desktop; the pagination fades away
 * three seconds after the last touch, scroll, focus, or navigation action.
 */
function MobileCardSlider({ className = "", label = "Cards", children, onActiveIndexChange }) {
  const trackRef = useRef(null);
  const hideTimerRef = useRef(null);
  const items = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);

  const revealControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    revealControls();
    const trackLeft = track.getBoundingClientRect().left;
    const cards = Array.from(track.children);
    let nextIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextIndex = index;
      }
    });

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    if (onActiveIndexChange) onActiveIndexChange(nextIndex);
  };

  const goToIndex = (index) => {
    revealControls();
    setActiveIndex(index);
    if (onActiveIndexChange) onActiveIndexChange(index);

    const track = trackRef.current;
    const card = track?.children[index];
    if (!track || !card) return;

    const distance = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    track.scrollTo({
      left: track.scrollLeft + distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  return (
    <div className="hci-mobile-slider-shell">
      <div className="hci-mobile-slider-frame">
      <div
        ref={trackRef}
        className={`hci-mobile-slider-track ${className}`.trim()}
        onTouchStart={revealControls}
        onPointerDown={revealControls}
        onScroll={handleScroll}
        onFocusCapture={revealControls}
      >
        {items}
      </div>
      {items.length > 1 && activeIndex > 0 ? (
        <button
          type="button"
          className="hci-mobile-slider-arrow is-prev"
          aria-label={`Previous ${label.toLowerCase()}`}
          onClick={() => goToIndex(activeIndex - 1)}
        >
          <Icon name="arrow" size={18} />
        </button>
      ) : null}
      {items.length > 1 && activeIndex < items.length - 1 ? (
        <button
          type="button"
          className="hci-mobile-slider-arrow is-next"
          aria-label={`Next ${label.toLowerCase()}`}
          onClick={() => goToIndex(activeIndex + 1)}
        >
          <Icon name="arrow" size={18} />
        </button>
      ) : null}
      </div>
      {items.length > 1 ? (
        <div
          className={`hci-mobile-slider-controls${controlsVisible ? " is-visible" : ""}`}
          aria-label={`${label} slider navigation`}
        >
          {items.map((item, index) => (
            <button
              type="button"
              key={item.key ?? `${label}-${index}`}
              className={`hci-mobile-slider-dot${index === activeIndex ? " is-active" : ""}`}
              aria-label={`Show ${label.toLowerCase()} ${index + 1} of ${items.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              tabIndex={controlsVisible ? 0 : -1}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

// maps this form's field names to the shared rules in leadValidation.js
const LEAD_FIELD_MAP = {
  name: "fullName",
  phone: "contact",
  email: "email",
  city: "place",
  consent: "termsAndConditions",
};
const LEAD_FIELDS = ["name", "phone", "email", "city", "consent"];
const EMPTY_LEAD = { name: "", phone: "", email: "", city: "", consent: false };

const sanitizeLeadPhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  return digits.slice(0, 10);
};

function LeadForm({
  idSuffix = "",
  leadFormType = "inline",
  leadFormName = "Landing Page Form",
  ctaText = "Schedule a Design Consultation",
}) {
  const pathname = usePathname();
const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(EMPTY_LEAD);
  const [errors, setErrors] = useState({});

  // Email is optional: an empty value is fine, but anything typed is still checked by the shared email rules.
  const validateField = (name, value) => {
    if (name === "email" && !String(value).trim()) return "";
    return validateLeadField(LEAD_FIELD_MAP[name], value);
  };

  const handleChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === "phone") value = sanitizeLeadPhone(value);
    if (name === "email") value = value.toLowerCase().replace(/\s/g, "");
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const trimmed = name === "email" ? value.trim().toLowerCase() : value.trim();
    setFormData((prev) => ({ ...prev, [name]: trimmed }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, trimmed) }));
  };

  const handleConsent = (event) => {
    const { checked } = event.target;
    setFormData((prev) => ({ ...prev, consent: checked }));
    setErrors((prev) => ({ ...prev, consent: validateField("consent", checked) }));
  };

  async function handleSubmit(event) {
  event.preventDefault();
  setSubmitError("");

  const newErrors = {};
  LEAD_FIELDS.forEach((field) => {
    const err = validateField(field, formData[field]);
    if (err) newErrors[field] = err;
  });
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  setSubmitting(true);
  try {
    const response = await api.post("/user-queries", {
      name: formData.name.trim(),
      mobile: formData.phone.trim(),
      ...(formData.email.trim() ? { email: formData.email.trim().toLowerCase() } : {}),
      place: formData.city.trim(),
      ...buildLeadMetadata({
        pathname,
        leadFormType,
        leadFormName,
        ctaText,
      }),
    });

    if (response.status === 201) {
      setFormData(EMPTY_LEAD);
      setErrors({});
      window.location.href = "/thank-you";
    } else {
      setSubmitError("Submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Landing form submit error:", error.response?.data || error);
    const serverMsg = error.response?.data?.message;
    const msg = Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg;
    setSubmitError(
      error.response
        ? msg || "Submission failed. Please check your details."
        : "Network error. Please check your connection."
    );
  } finally {
    setSubmitting(false);
  }
}

  const fieldProps = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    className: errors[name] ? "is-invalid" : "",
    "aria-invalid": errors[name] ? true : undefined,
    required: name !== "email",
  });

  return (
    <form className="hci-lead-form" onSubmit={handleSubmit} noValidate>
      <div className="hci-form-heading">
        <h2>Get a free design consultation</h2>
      </div>
      <div className="hci-form-grid">
        <label>
          <span>Your name <b className="hci-req">*</b></span>
          <input {...fieldProps("name")} autoComplete="name" placeholder="Full name" maxLength={60} />
          {errors.name && <small className="hci-form-error">{errors.name}</small>}
        </label>
        <label>
          <span>Mobile number <b className="hci-req">*</b></span>
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <small className="hci-form-error">{errors.phone}</small>}
        </label>
        <label>
          <span>Email address</span>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            maxLength={100}
            placeholder="you@example.com"
          />
          {errors.email && <small className="hci-form-error">{errors.email}</small>}
        </label>
        <label>
          <span>City <b className="hci-req">*</b></span>
          <input
            {...fieldProps("city")}
            list={`hci-city-options${idSuffix}`}
            autoComplete="address-level2"
            maxLength={50}
            placeholder="Noida, Gurugram…"
          />
          <datalist id={`hci-city-options${idSuffix}`}>
            {locations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
          {errors.city && <small className="hci-form-error">{errors.city}</small>}
        </label>
      </div>
      <label className="hci-form-consent">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleConsent}
          aria-invalid={errors.consent ? true : undefined}
          required
        />
        <span>
          I agree to the <strong>Privacy Policy</strong> and <strong>Terms and Conditions</strong>.
        </span>
      </label>
      {errors.consent && <small className="hci-form-error">{errors.consent}</small>}
      <button className="hci-button hci-button-primary hci-submit" type="submit" disabled={submitting}>
  {submitting ? "Submitting..." : "Schedule a Design Consultation"}
</button>
{submitError ? <p className="hci-form-error" role="alert" style={{ marginTop: 12 }}>{submitError}</p> : null}
    </form>
  );
}

/* Consultation form shown as a pop-up over the current section (no scrolling, no redirect). */
function LeadPopup({ open, ctaText, onClose }) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const focusTimer = setTimeout(() => boxRef.current?.querySelector("input")?.focus(), 60);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="hci-popup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="hci-popup-box" ref={boxRef} role="dialog" aria-modal="true" aria-label="Get a free design consultation">
        <button type="button" className="hci-popup-close" onClick={onClose} aria-label="Close form">×</button>
        <LeadForm
          idSuffix="-popup"
          leadFormType="popup"
          leadFormName="Landing Page Popup Form"
          ctaText={ctaText}
        />
      </div>
    </div>
  );
}

/* Always-visible quick contact buttons. The estimate pill appears once the top form scrolls out of view. */
function FloatingDock({ showEstimate, onEstimate }) {
  return (
    <div className={`hci-dock${showEstimate ? " has-bar" : ""}`} aria-label="Quick contact">
      <button
        type="button"
        className={`hci-dock-estimate${showEstimate ? "" : " is-hidden"}`}
        onClick={onEstimate}
        tabIndex={showEstimate ? 0 : -1}
      >
        <span className="hci-dock-label-desktop">Get Design Quote</span>
        <span className="hci-dock-label-mobile">Let’s Get Started</span>
      </button>
      <a
        className="hci-dock-btn hci-dock-whatsapp"
        href={whatsappUrl(WHATSAPP_GREETING)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HC Interior on WhatsApp"
      >
        <Icon name="whatsapp" size={30} />
      </a>
      <a className="hci-dock-btn hci-dock-call" href={`tel:+${CALL_NUMBER}`} aria-label={`Call HC Interior on ${CALL_DISPLAY}`}>
        <Icon name="phone-call" size={23} />
      </a>
    </div>
  );
}

/* "Every room should earn its place" – hover, tap or focus a point to change the photo and open its details. */
function StorySection({ onEstimate }) {
  const [active, setActive] = useState(0);
  const point = storyPoints[active];
  const titleWords = ["Every", "room", "should", "earn", "its", "place."];

  return (
    <section className="hci-story-section" aria-labelledby="hci-story-title">
      <div className="hci-story-visual">
        {storyPoints.map((item, index) => (
          <div className={`hci-story-slide${index === active ? " is-active" : ""}`} key={item.key} aria-hidden={index !== active}>
            <img src={item.image} alt={item.alt} loading="lazy" />
          </div>
        ))}
        <div className="hci-story-tag">
          <span className="hci-story-dot" />
          <span>Idea to interior</span>
          <strong key={point.key}>{point.short}</strong>
        </div>
      </div>

      <div className="hci-story-copy">
        <span className="hci-eyebrow">A MORE CONSIDERED HOME</span>
        <h2 className="hci-story-title" id="hci-story-title">
          {titleWords.map((word) => (
            <Fragment key={word}>
              <span className="hci-story-word">{word}</span>{" "}
            </Fragment>
          ))}
        </h2>
        <p>A beautiful interior does more than look good. It brings together movement, storage, materials and comfort so your home works well in everyday life.</p>

        <div className="hci-story-points">
          {storyPoints.map((item, index) => {
            const isActive = index === active;
            return (
              <button
                type="button"
                key={item.key}
                className={`hci-story-point${isActive ? " is-active" : ""}`}
                aria-expanded={isActive}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <span className="hci-story-point-icon"><Icon name={item.icon} size={20} /></span>
                <span className="hci-story-point-body">
                  <strong>{item.title}</strong>
                  <span className="hci-story-point-more">
                    <span><span className="hci-story-point-text">{item.text}</span></span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="hci-story-actions">
          <button type="button" className="hci-button hci-button-primary" onClick={onEstimate}>Get Design Quote</button>
        </div>
      </div>
    </section>
  );
}

/* All page styles (previously inside <style jsx global>). Kept byte-for-byte; only the delivery changed. */
const HCI_PAGE_CSS = `
        /* Base theme + sections that were not changed (benefits, property strip, process, stats, experience, locations, FAQ, final CTA). */
        :root { --hci-navy: #232722; --hci-blue: #ff914d; --hci-blue-deep: #f57735; --hci-orange: #ff914d; --hci-orange-deep: #f57735; --hci-ink: #272b27; --hci-muted: #69716b; --hci-pale: #f8f6f2; --hci-line: #e6e0d7; --hci-white: #fff; --hci-green: #143f34; }
        .hci-page { color: var(--hci-ink); background: #fff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 15px; line-height: 1.55; overflow: hidden; }
        .hci-page a { color: inherit; text-decoration: none; }
        .hci-page button, .hci-page input, .hci-page select { font: inherit; }
        .hci-page img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .hci-button { min-height: 48px; padding: 0 19px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; border-radius: 3px; border: 1px solid transparent; font-size: 13px; font-weight: 750; letter-spacing: .005em; cursor: pointer; transition: transform .2s ease, background .2s ease, box-shadow .2s ease; }
        .hci-button:hover { transform: translateY(-2px); }
        .hci-button-primary { background: linear-gradient(90deg, #ff914d 0%, #ff783e 100%); color: #fff !important; box-shadow: 0 8px 20px rgba(255,145,77,.22); }
        .hci-button-primary:hover { background: linear-gradient(90deg, #f98540 0%, #ef6933 100%); box-shadow: 0 10px 25px rgba(255,126,62,.3); }
        .hci-button-icon { width: 25px; height: 25px; display: inline-grid; flex: 0 0 25px; place-items: center; border: 1px solid rgba(255,255,255,.82); border-radius: 50%; color: #fff; }
        .hci-button-icon svg { width: 14px; height: 14px; }
        .hci-eyebrow { color: var(--hci-blue); font-size: 10px; font-weight: 800; letter-spacing: .16em; line-height: 1.4; }
        .hci-text-link, .hci-inline-link { display: inline-flex; align-items: center; gap: 9px; color: var(--hci-navy) !important; font-size: 12px; font-weight: 750; }
        .hci-text-link:hover, .hci-inline-link:hover { color: var(--hci-blue) !important; }
        .hci-benefits { width: min(1240px, calc(100% - 64px)); min-height: 140px; margin: auto; display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--hci-line); }
        .hci-benefit { display: flex; align-items: center; gap: 17px; padding: 30px 28px; position: relative; }
        .hci-benefit:not(:last-child)::after { content: ""; position: absolute; top: 31px; bottom: 31px; right: 0; width: 1px; background: var(--hci-line); }
        .hci-icon-wrap { width: 46px; height: 46px; display: grid; place-items: center; flex-shrink: 0; color: var(--hci-blue); background: #fff0e6; border-radius: 50%; }
        .hci-benefit h2 { margin: 0 0 5px; font-size: 13px; color: var(--hci-navy); letter-spacing: -.02em; }
        .hci-benefit p { margin: 0; max-width: 245px; color: var(--hci-muted); font-size: 11px; line-height: 1.65; }
        .hci-property-strip { padding: 45px max(32px, calc((100vw - 1240px) / 2)) 38px; display: grid; grid-template-columns: .95fr 1.5fr; align-items: center; column-gap: 40px; background: #f8f6f2; }
        .hci-property-intro h2 { margin: 9px 0 0; color: var(--hci-navy); font-size: 29px; letter-spacing: -.05em; line-height: 1.15; }
        .hci-property-options { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 10px; }
        .hci-property-option { min-height: 66px; border: 1px solid #e6dfd5; border-radius: 6px; display: flex; gap: 7px; align-items: center; justify-content: center; flex-direction: column; background: white; color: var(--hci-navy); cursor: pointer; font-size: 10px; font-weight: 750; transition: .2s ease; }
        .hci-property-option:hover { border-color: var(--hci-blue); }
        .hci-property-option.is-selected { background: var(--hci-navy); border-color: var(--hci-navy); color: white; box-shadow: 0 7px 17px rgba(38,43,37,.12); }
        .hci-property-hint { grid-column: 2; color: #7b827c; margin: 10px 0 0; font-size: 10px; }
        .hci-section { width: min(1240px, calc(100% - 64px)); margin: 0 auto; }
        .hci-section-heading { display: flex; align-items: end; justify-content: space-between; gap: 40px; margin-bottom: 38px; }
        .hci-section-heading h2, .hci-faq-intro h2 { margin: 10px 0 0; color: var(--hci-navy); font-size: clamp(30px, 3.3vw, 43px); line-height: 1.12; letter-spacing: -.055em; }
        .hci-section-heading > p { max-width: 410px; color: var(--hci-muted); font-size: 13px; line-height: 1.8; margin: 0 0 3px; }
        .hci-process-section { padding: 95px 0 88px; background: white; }
        .hci-process-inner .hci-section-heading { align-items: end; }
        .hci-process-inner .hci-section-heading h2 { max-width: 650px; }
        .hci-process-grid { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 20px; margin-top: 55px; }
        .hci-process-marker { height: 35px; margin-bottom: 18px; position: relative; display: flex; align-items: center; }
        .hci-process-marker span { position: relative; z-index: 1; display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid var(--hci-blue); border-radius: 50%; background: white; color: var(--hci-blue); font-size: 10px; font-weight: 800; }
        .hci-process-step:not(:last-child) .hci-process-marker i { position: absolute; left: 34px; right: -20px; top: 17px; height: 1px; background: #ddd6cc; }
        .hci-process-step h3 { color: var(--hci-navy); margin: 0 0 8px; font-size: 14px; letter-spacing: -.02em; text-transform: capitalize; }
        .hci-process-step p { max-width: 195px; color: var(--hci-muted); font-size: 11px; line-height: 1.75; margin: 0; }
        .hci-process-footnote { display: flex; align-items: center; gap: 9px; margin-top: 44px; padding: 15px 17px; background: #f8f6f2; color: #5b655d; font-size: 10px; }
        .hci-process-footnote svg { color: var(--hci-blue); flex-shrink: 0; }
        .hci-locations-section { background: #f8f6f2; border-top: 1px solid #e7e1d8; border-bottom: 1px solid #e7e1d8; }
        .hci-locations-inner { min-height: 145px; display: grid; grid-template-columns: 48px 1fr 1.4fr; align-items: center; gap: 18px; padding-top: 26px; padding-bottom: 26px; }
        .hci-faq-section { padding-top: 100px; padding-bottom: 105px; display: grid; grid-template-columns: .7fr 1.3fr; gap: 9%; }
        .hci-faq-intro h2 { margin-bottom: 14px; }
        .hci-faq-intro > p { max-width: 280px; color: var(--hci-muted); font-size: 12px; line-height: 1.8; margin: 0 0 16px; }
        .hci-faq-list { border-top: 1px solid var(--hci-line); }
        .hci-faq-item { padding: 0; border-bottom: 1px solid var(--hci-line); }
        .hci-faq-item h3 { margin: 0; }
        .hci-faq-item button { width: 100%; min-height: 65px; padding: 14px 0; background: transparent; border: 0; display: flex; align-items: center; justify-content: space-between; gap: 20px; text-align: left; color: var(--hci-navy); font-size: 13px; font-weight: 700; cursor: pointer; }
        .hci-faq-toggle { width: 26px; height: 26px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: #fff0e6; color: var(--hci-blue); font-size: 18px; font-weight: 450; }
        .hci-faq-item > p { max-width: 650px; color: var(--hci-muted); font-size: 12px; line-height: 1.8; margin: -1px 38px 20px 0; }
        .hci-faq-item.is-open button { color: var(--hci-blue); }
        .hci-final-cta { min-height: 330px; display: grid; grid-template-columns: .85fr 1.15fr; background: var(--hci-green); color: #fff; }
        .hci-final-cta-image { min-height: 330px; overflow: hidden; }
        .hci-final-cta-copy { align-self: center; padding: 55px clamp(35px,8vw,125px); }
        .hci-final-cta-copy .hci-eyebrow { color: #ffd0ad; }
        .hci-page .hci-final-cta .hci-final-cta-copy h2 { margin: 10px 0 13px; color: #fff !important; font-size: clamp(32px,3.5vw,46px); line-height: 1.1; letter-spacing: -.055em; }
        .hci-final-cta-copy > p { max-width: 435px; color: #e4e8e2; font-size: 12px; line-height: 1.8; margin: 0; }
        .hci-final-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 23px; margin-top: 24px; }
        .hci-phone-link { display: inline-flex; align-items: center; gap: 8px; color: #f6f5ef !important; font-size: 11px; font-weight: 700; }
        @media (max-width: 1080px) {
        .hci-benefits, .hci-section { width: min(100% - 44px, 1240px); }
        .hci-property-strip { padding-left: 32px; padding-right: 32px; grid-template-columns: 1fr; gap: 22px; }
        .hci-property-hint { grid-column: 1; }
        .hci-process-grid { gap: 14px; }
        .hci-locations-inner { grid-template-columns: 44px 1fr; }
        }
        @media (max-width: 760px) {
        .hci-button { min-height: 46px; padding: 0 14px; font-size: 12px; }
        .hci-text-link { font-size: 11px; }
        .hci-benefits { width: calc(100% - 40px); padding-top: 35px; padding-bottom: 22px; grid-template-columns: 1fr; }
        .hci-benefit { padding: 13px 0; gap: 13px; }
        .hci-benefit:not(:last-child)::after { display: none; }
        .hci-benefit h2 { font-size: 12px; }
        .hci-benefit p { max-width: 100%; font-size: 10px; }
        .hci-icon-wrap { width: 40px; height: 40px; }
        .hci-property-strip { padding: 38px 20px 29px; gap: 20px; }
        .hci-property-intro h2 { font-size: 27px; }
        .hci-property-options { grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .hci-property-option { min-height: 62px; font-size: 9px; }
        .hci-property-hint { margin-top: -10px; font-size: 9px; }
        .hci-section { width: calc(100% - 40px); }
        .hci-section-heading { margin-bottom: 25px; gap: 18px; align-items: flex-start; flex-direction: column; }
        .hci-section-heading h2, .hci-faq-intro h2 { font-size: 32px; }
        .hci-section-heading > p { max-width: 100%; font-size: 12px; }
        .hci-process-section { padding: 65px 0 58px; }
        .hci-process-inner .hci-section-heading { align-items: flex-start; }
        .hci-process-grid { grid-template-columns: 1fr; gap: 22px; margin-top: 32px; }
        .hci-process-step { display: grid; grid-template-columns: 39px 1fr; column-gap: 12px; }
        .hci-process-marker { grid-row: span 2; margin: 0; height: 100%; align-items: start; }
        .hci-process-step:not(:last-child) .hci-process-marker i { left: 16px; right: auto; top: 35px; bottom: -28px; width: 1px; height: auto; }
        .hci-process-step h3 { font-size: 13px; padding-top: 3px; }
        .hci-process-step p { max-width: 100%; font-size: 10px; }
        .hci-process-footnote { margin-top: 30px; align-items: flex-start; font-size: 10px; line-height: 1.6; }
        .hci-locations-inner { grid-template-columns: 38px 1fr; gap: 12px; padding-top: 25px; padding-bottom: 25px; }
        .hci-faq-section { display: flex; flex-direction: column; gap: 28px; padding-top: 65px; padding-bottom: 67px; }
        .hci-faq-intro h2 { margin-bottom: 10px; }
        .hci-faq-intro > p { max-width: 100%; }
        .hci-faq-item button { min-height: 61px; font-size: 12px; }
        .hci-faq-item > p { font-size: 11px; margin-right: 8px; }
        .hci-final-cta { display: flex; flex-direction: column; }
        .hci-final-cta-image { min-height: unset; height: 240px; }
        .hci-final-cta-copy { padding: 40px 22px 45px; }
        .hci-final-cta-copy h2 { font-size: 34px; }
        .hci-final-cta-copy > p { font-size: 11px; }
        .hci-final-actions { gap: 15px; }
        }
        @media (prefers-reduced-motion: reduce) {
        .hci-page *, .hci-page *::before, .hci-page *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
        }
        .hci-page { --hci-navy: #232722; --hci-blue: #ff914d; --hci-blue-deep: #f57735; --hci-orange: #ff914d; --hci-orange-deep: #f57735; --hci-ink: #272b27; --hci-muted: #69716b; --hci-pale: #f8f6f2; --hci-line: #e6e0d7; --hci-green: #143f34; font-size: 16px; }
        .hci-page .hci-eyebrow { color: var(--hci-orange-deep); font-size: 11px; }
        .hci-page .hci-button { font-size: 15px; }
        .hci-page .hci-button-primary { border-radius: 4px; background: linear-gradient(90deg, #ff914d 0%, #ff783e 100%); }
        .hci-page .hci-text-link, .hci-page .hci-inline-link { color: #292d29 !important; font-size: 14px; }
        .hci-page .hci-text-link:hover, .hci-page .hci-inline-link:hover { color: var(--hci-orange-deep) !important; }
        .hci-page .hci-benefit h2 { font-size: 16px; }
        .hci-page .hci-benefit p { font-size: 13px; }
        .hci-page .hci-icon-wrap { color: var(--hci-orange-deep); background: #fff0e6; }
        .hci-page .hci-property-strip { background: #f8f6f2; }
        .hci-page .hci-property-option { font-size: 13px; border-color: #e2dbd1; }
        .hci-page .hci-property-option.is-selected { background: var(--hci-orange); border-color: var(--hci-orange); color: #fff; box-shadow: 0 7px 17px rgba(255,145,77,.18); }
        .hci-page .hci-property-option:hover { border-color: var(--hci-orange); }
        .hci-page .hci-property-hint { font-size: 12px; }
        .hci-page .hci-section-heading h2, .hci-page .hci-faq-intro h2 { color: #232722; font-size: clamp(34px, 3.4vw, 48px); }
        .hci-page .hci-section-heading > p { font-size: 15px; }
        .hci-page .hci-process-step h3 { font-size: 16px; }
        .hci-page .hci-process-step p { font-size: 13px; }
        .hci-page .hci-process-marker span { border-color: var(--hci-orange); color: var(--hci-orange-deep); }
        .hci-page .hci-process-footnote { font-size: 12px; background: #f8f6f2; }
        .hci-page .hci-final-cta { background: #143f34; }
        .hci-page .hci-final-cta-copy .hci-eyebrow { color: #ffd0ad; }
        .hci-page .hci-final-cta .hci-final-cta-copy h2 { color: #fff !important; }
        .hci-page .hci-experience-section { padding: 66px 0 72px; background: #fff; }
        .hci-page .hci-experience-inner { width: min(1320px, calc(100% - 64px)); }
        .hci-page .hci-experience-heading { align-items: end; margin-bottom: 30px; }
        .hci-page .hci-experience-heading h2 { max-width: 700px; }
        .hci-page .hci-experience-heading > p { max-width: 450px; }
        .hci-page .hci-experience-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 24px; }
        .hci-page .hci-experience-card { min-width: 0; overflow: hidden; border: 1px solid #eee9e1; border-radius: 20px; background: #fff; box-shadow: 0 5px 18px rgba(35,39,34,.055); }
        .hci-page .hci-experience-content { padding: 22px 24px 25px; }
        .hci-page .hci-experience-kicker { color: #8b8b80; font-size: 11px; font-weight: 800; letter-spacing: .13em; }
        .hci-page .hci-experience-content h3 { margin: 5px 0 8px; color: #252a25; font-size: 25px; line-height: 1.2; }
        .hci-page .hci-experience-content p { min-height: 46px; margin: 0 0 18px; color: #686f68; font-size: 14px; line-height: 1.65; }
        .hci-page .hci-locations-section { padding: 72px 0 76px; border: 0; background: #143f34; color: #fff; }
        .hci-page .hci-locations-inner { min-height: unset; display: grid; grid-template-columns: minmax(230px, .72fr) minmax(0, 1.6fr); align-items: center; gap: 48px; padding-top: 0; padding-bottom: 0; }
        .hci-page .hci-locations-intro .hci-eyebrow { color: #ffc092; }
        .hci-page .hci-locations-intro h2 { margin: 14px 0 17px; color: #fff !important; font-size: clamp(32px, 3vw, 42px); line-height: 1.12; letter-spacing: -.04em; }
        .hci-page .hci-locations-intro p { max-width: 320px; margin: 0; color: #d0dfd8; font-size: 15px; line-height: 1.8; }
        .hci-page .hci-location-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px 24px; }
        .hci-page .hci-location-card { min-height: 82px; display: flex; align-items: center; gap: 16px; padding: 14px 19px; border: 1px solid rgba(255,255,255,.24); border-radius: 18px; background: rgba(255,255,255,.045); color: #fff !important; transition: border-color .2s ease, background .2s ease, transform .2s ease; }
        .hci-page .hci-location-card:hover { border-color: rgba(255,255,255,.48); background: rgba(255,255,255,.09); transform: translateY(-2px); }
        .hci-page .hci-location-card-icon { width: 48px; height: 48px; flex: 0 0 48px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: rgba(255,255,255,.13); }
        .hci-page .hci-location-card-copy { min-width: 0; display: flex; flex: 1; flex-direction: column; gap: 1px; }
        .hci-page .hci-location-card-copy strong { color: #fff; font-size: 20px; line-height: 1.25; font-weight: 650; }
        .hci-page .hci-location-card-copy small { color: #d0dfd8; font-size: 14px; line-height: 1.45; }
        .hci-page .hci-faq-item button { font-size: 15px; }
        .hci-page .hci-faq-item > p { font-size: 14px; }
        .hci-page .hci-faq-toggle { background: #fff0e6; color: #ed7836; }
        .hci-page .hci-faq-item.is-open button { color: #ed7836; }
        @media (max-width: 1080px) {
        .hci-page .hci-experience-inner { width: min(100% - 44px, 1240px); }
        .hci-page .hci-experience-grid { gap: 16px; }
        .hci-page .hci-experience-content { padding: 19px; }
        .hci-page .hci-experience-content h3 { font-size: 22px; }
        .hci-page .hci-locations-inner { grid-template-columns: minmax(190px,.65fr) minmax(0,1.5fr); gap: 25px; }
        .hci-page .hci-location-grid { gap: 12px; }
        .hci-page .hci-location-card { gap: 11px; padding: 13px; }
        .hci-page .hci-location-card-copy strong { font-size: 18px; }
        .hci-page .hci-location-card-copy small { font-size: 12px; }
        }
        @media (max-width: 760px) {
        .hci-page .hci-button { font-size: 14px; }
        .hci-page .hci-section-heading h2, .hci-page .hci-faq-intro h2 { font-size: 34px; }
        .hci-page .hci-experience-section { padding: 46px 0 50px; }
        .hci-page .hci-experience-inner { width: calc(100% - 36px); }
        .hci-page .hci-experience-heading { margin-bottom: 22px; }
        .hci-page .hci-experience-grid { grid-template-columns: 1fr; gap: 16px; }
        .hci-page .hci-experience-content { padding: 19px 20px 22px; }
        .hci-page .hci-experience-content h3 { font-size: 23px; }
        .hci-page .hci-experience-content p { min-height: unset; font-size: 14px; }
        .hci-page .hci-locations-section { padding: 50px 0 54px; }
        .hci-page .hci-locations-inner { width: calc(100% - 36px); grid-template-columns: 1fr; gap: 25px; }
        .hci-page .hci-locations-intro h2 { font-size: 34px; }
        .hci-page .hci-locations-intro p { font-size: 14px; }
        .hci-page .hci-location-grid { grid-template-columns: 1fr; gap: 10px; }
        .hci-page .hci-location-card { min-height: 76px; border-radius: 15px; padding: 12px 14px; }
        .hci-page .hci-location-card-icon { width: 43px; height: 43px; flex-basis: 43px; }
        .hci-page .hci-location-card-copy strong { font-size: 18px; }
        .hci-page .hci-location-card-copy small { font-size: 13px; }
        .hci-page .hci-faq-item button { font-size: 14px; }
        .hci-page .hci-faq-item > p { font-size: 13px; }
        }
        .hci-page .hci-stats { width: 100%; background: #143f34; color: #fff; }
        .hci-page .hci-stats-inner { width: min(1400px, calc(100% - 64px)); min-height: 148px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); align-items: stretch; }
        .hci-page .hci-stat { min-width: 0; display: flex; flex-direction: column; justify-content: center; padding: 22px 28px; border-right: 1px solid rgba(255,255,255,.18); }
        .hci-page .hci-stat:first-child { border-left: 1px solid rgba(255,255,255,.12); }
        .hci-page .hci-stat strong { color: #fff; font-size: clamp(34px, 3.1vw, 48px); font-weight: 650; letter-spacing: -.045em; line-height: 1.1; font-variant-numeric: tabular-nums; }
        .hci-page .hci-stat span { margin-top: 8px; color: #f3f1e9; font-size: 15px; line-height: 1.4; }
        .hci-page .hci-experience-section { padding: 56px 0 38px; background: #fff; }
        .hci-page .hci-experience-inner { width: min(1320px, calc(100% - 64px)); }
        .hci-page .hci-experience-heading { max-width: 690px; margin-bottom: 48px; }
        .hci-page .hci-experience-heading h2 { margin: 0; color: #171a17; font-size: clamp(34px, 3vw, 44px); line-height: 1.18; letter-spacing: -.045em; font-weight: 500; }
        .hci-page .hci-experience-heading p { max-width: 660px; margin: 4px 0 0; color: #68716a; font-size: 18px; line-height: 1.7; }
        .hci-page .hci-experience-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); align-items: stretch; gap: 26px; }
        .hci-page .hci-experience-card { display: flex; min-width: 0; overflow: hidden; border: 1px solid #d2dbd5; border-radius: 16px; background: #fff; box-shadow: none; }
        .hci-page .hci-experience-content { display: flex; width: 100%; flex-direction: column; align-items: flex-start; padding: 30px 31px 28px; }
        .hci-page .hci-experience-pin { width: 50px; height: 50px; margin-bottom: 20px; display: grid; place-items: center; border-radius: 50%; color: #174b3c; background: #edf1ed; }
        .hci-page .hci-experience-content h3 { margin: 0 0 2px; color: #171a17; font-size: 34px; font-weight: 500; line-height: 1.2; letter-spacing: -.04em; }
        .hci-page .hci-experience-kicker { margin-bottom: 4px; color: #6c756f; font-size: 14px; letter-spacing: 0; font-weight: 500; }
        .hci-page .hci-experience-content p { min-height: 90px; margin: 0 0 14px; color: #151815; font-size: 16px; line-height: 1.72; overflow-wrap: anywhere; }
        .hci-page .hci-experience-phone { margin-bottom: 24px; color: #151815 !important; font-size: 16px; font-weight: 500; }
        .hci-page .hci-experience-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: auto; }
        .hci-page .hci-directions-button, .hci-page .hci-see-center-button { min-height: 48px; padding: 0 21px; display: inline-flex; align-items: center; justify-content: center; border-radius: 9px; font-size: 15px; font-weight: 550; white-space: nowrap; transition: background .2s ease, color .2s ease, transform .2s ease; }
        .hci-page .hci-directions-button { border: 1px solid #ff914d; background: #ff914d; color: #171a17 !important; }
        .hci-page .hci-directions-button:hover { background: #ff7f36; transform: translateY(-1px); }
        .hci-page .hci-see-center-button { border: 2px solid #174b3c; background: #fff; color: #171a17 !important; }
        .hci-page .hci-see-center-button:hover { background: #174b3c; color: #fff !important; }
        @media (max-width: 1080px) {
        .hci-page .hci-stats-inner { width: calc(100% - 40px); }
        .hci-page .hci-stat { padding: 20px 18px; }
        .hci-page .hci-stat span { font-size: 13px; }
        .hci-page .hci-experience-inner { width: calc(100% - 44px); }
        .hci-page .hci-experience-grid { gap: 14px; }
        .hci-page .hci-experience-content { padding: 24px 21px; }
        .hci-page .hci-experience-content h3 { font-size: 27px; }
        .hci-page .hci-experience-content p { font-size: 14px; }
        .hci-page .hci-directions-button, .hci-page .hci-see-center-button { min-height: 44px; padding: 0 14px; font-size: 14px; }
        }
        @media (max-width: 760px) {
        .hci-page .hci-stats-inner { width: calc(100% - 28px); grid-template-columns: repeat(2, minmax(0,1fr)); }
        .hci-page .hci-stat { min-height: 106px; padding: 18px 16px; border-bottom: 1px solid rgba(255,255,255,.16); }
        .hci-page .hci-stat:nth-child(odd) { border-left: 1px solid rgba(255,255,255,.12); }
        .hci-page .hci-stat strong { font-size: 35px; }
        .hci-page .hci-stat span { margin-top: 5px; font-size: 13px; }
        .hci-page .hci-experience-section { padding: 42px 0 32px; }
        .hci-page .hci-experience-inner { width: calc(100% - 32px); }
        .hci-page .hci-experience-heading { margin-bottom: 27px; }
        .hci-page .hci-experience-heading h2 { font-size: 34px; }
        .hci-page .hci-experience-heading p { font-size: 16px; }
        .hci-page .hci-experience-grid { grid-template-columns: 1fr; gap: 14px; }
        .hci-page .hci-experience-content { padding: 23px 22px 22px; }
        .hci-page .hci-experience-pin { width: 44px; height: 44px; margin-bottom: 15px; }
        .hci-page .hci-experience-content h3 { font-size: 29px; }
        .hci-page .hci-experience-content p { min-height: unset; margin-bottom: 12px; font-size: 15px; }
        .hci-page .hci-experience-phone { margin-bottom: 19px; font-size: 15px; }
        .hci-page .hci-experience-actions { gap: 9px; }
        .hci-page .hci-directions-button, .hci-page .hci-see-center-button { min-height: 44px; padding: 0 14px; font-size: 13px; }
        }

        /* ============================================================
           HC Interior landing page – layout and interaction styles
           (everything below the unchanged-section rules above)
           ============================================================ */
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        .hci-page { --hci-serif: "Playfair Display", "Cormorant Garamond", Georgia, "Times New Roman", serif; }
        .hci-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
        .hci-page :focus-visible { outline: 3px solid rgba(245,119,53,.55); outline-offset: 3px; }

        /* ---------- Buttons (rounded, shared by every section) ---------- */
        .hci-page .hci-button { border-radius: 12px; }
        .hci-page .hci-button-primary { border-radius: 12px; }
        .hci-page .hci-button-ghost { border: 2px solid #174b3c; background: rgba(255,255,255,.72); color: #174b3c !important; backdrop-filter: blur(6px); box-shadow: none; }
        .hci-page .hci-button-ghost:hover { background: #174b3c; color: #fff !important; }
        .hci-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .hci-cta-row.is-centered { justify-content: center; margin-top: 52px; }
        .hci-page .hci-cta-row .hci-button { min-height: 54px; padding: 0 18px; font-size: 15px; font-weight: 600; white-space: nowrap; }

        /* ---------- Hero: typing headline on the left, form on the right ---------- */
        .hci-page .hci-hero { position: relative; isolation: isolate; overflow: hidden; padding: clamp(36px, 5vw, 68px) 0; background: #f8f6f2; }
        .hci-hero-bg { position: absolute; inset: 0; z-index: -1; }
        .hci-hero-bg img { opacity: .6; filter: saturate(.85); }
        .hci-hero-bg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, rgba(250,249,246,.96) 0%, rgba(250,249,246,.88) 48%, rgba(250,249,246,.66) 100%); }
        .hci-hero-inner { width: min(1240px, calc(100% - 64px)); margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(380px, .8fr); gap: clamp(32px, 4.5vw, 64px); align-items: center; }
        .hci-hero-title { min-height: 3.45em; margin: 0 0 34px; color: #16231d; font-size: clamp(34px, 4.2vw, 58px); font-weight: 600; line-height: 1.1; letter-spacing: -.045em; }
        .hci-caret { display: inline-block; width: 3px; height: .88em; margin-left: 5px; vertical-align: -.1em; background: var(--hci-orange); animation: hciCaret 1s steps(1) infinite; }
        @keyframes hciCaret { 50% { opacity: 0; } }
        .hci-hero-areas { max-width: 600px; margin: 0 0 22px; display: flex; gap: 10px; color: #26332d; font-size: 16px; line-height: 1.65; }
        .hci-hero-areas svg { flex: 0 0 auto; margin-top: 3px; color: var(--hci-orange-deep); }
        .hci-hero-points { display: grid; gap: 14px; margin: 0 0 34px; padding: 0; list-style: none; }
        .hci-hero-points li { display: flex; align-items: center; gap: 14px; color: #1f2b25; font-size: 16px; font-weight: 500; }
        .hci-hero-points li > span { width: 24px; height: 24px; flex: 0 0 24px; display: grid; place-items: center; border-radius: 50%; background: var(--hci-orange); color: #fff; }
        .hci-hero-points svg { stroke-width: 2.8; }

        /* Form card */
        .hci-lead-form { padding: clamp(24px, 3vw, 36px); border: 1px solid rgba(20,63,52,.08); border-radius: 24px; background: #fff; box-shadow: 0 34px 80px rgba(18,38,30,.16); }
        .hci-form-heading h2 { margin: 0 0 22px; color: #16231d; font-size: clamp(26px, 2.6vw, 34px); font-weight: 600; line-height: 1.15; letter-spacing: -.04em; }
        .hci-form-heading p { margin: 0 0 22px; color: var(--hci-muted); font-size: 14px; line-height: 1.6; }
        .hci-form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 14px; }
        .hci-form-grid label { min-width: 0; display: flex; flex-direction: column; gap: 7px; }
        .hci-form-grid label > span { color: #26332d; font-size: 13px; font-weight: 650; }
        .hci-form-grid input, .hci-form-grid textarea { width: 100%; min-width: 0; border: 1px solid #d8d6cf; border-radius: 12px; background: #fff; color: var(--hci-ink); font: inherit; font-size: 15px; outline: none; transition: border-color .2s ease, box-shadow .2s ease; }
        .hci-form-grid input { height: 50px; padding: 0 14px; }
        .hci-form-grid textarea { min-height: 96px; padding: 13px 14px; resize: vertical; line-height: 1.5; }
        .hci-form-grid input::placeholder, .hci-form-grid textarea::placeholder { color: #9b9b93; }
        .hci-form-grid input:focus, .hci-form-grid textarea:focus { border-color: var(--hci-orange); box-shadow: 0 0 0 4px rgba(255,145,77,.16); }
        .hci-req { color: #dc3545; font-weight: 700; }
.hci-form-grid input.is-invalid, .hci-form-grid textarea.is-invalid { border-color: #dc3545; background: #fff5f5; }
.hci-form-error { color: #dc3545; font-size: 12px; line-height: 1.4; }
.hci-form-consent + .hci-form-error { display: block; margin-top: 6px; }
        .hci-form-full { grid-column: 1 / -1; }
        .hci-form-consent { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; color: #59615a; font-size: 13px; line-height: 1.5; cursor: pointer; }
        .hci-form-consent input { width: 18px; height: 18px; flex: 0 0 18px; margin: 2px 0 0; accent-color: var(--hci-orange-deep); }
        .hci-page .hci-form-consent strong { color: #16231d; font-weight: 650; }
        .hci-page .hci-submit { width: 100%; min-height: 54px; margin-top: 18px; font-size: 16px; font-weight: 650; }
        .hci-form-note { margin: 12px 0 0; color: #7b827c; font-size: 12px; line-height: 1.55; }
        .hci-form-status { margin: 12px 0 0; padding: 11px 13px; border-radius: 10px; background: #eaf8ef; color: #0d5c39; font-size: 13px; line-height: 1.5; }

        /* ---------- Floating quick-contact buttons ---------- */
        .hci-dock { position: fixed; right: clamp(14px, 2vw, 26px); bottom: clamp(14px, 2vw, 26px); z-index: 80; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
        .hci-page .hci-dock-btn { width: 56px; height: 56px; display: grid; place-items: center; border-radius: 50%; color: #fff !important; box-shadow: 0 12px 28px rgba(0,0,0,.24); transition: transform .2s ease, box-shadow .2s ease; }
        .hci-page .hci-dock-btn:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 16px 34px rgba(0,0,0,.3); }
        .hci-page .hci-dock-whatsapp { background: #1fa855; }
        .hci-page .hci-dock-call { background: #143f34; }
        .hci-page .hci-dock-estimate { min-height: 48px; padding: 0 22px; display: inline-flex; align-items: center; border-radius: 999px; background: linear-gradient(90deg, #ff914d, #ff783e); color: #fff !important; font-size: 15px; font-weight: 700; box-shadow: 0 12px 28px rgba(245,119,53,.38); transition: opacity .25s ease, transform .25s ease, visibility .25s ease; }
        .hci-page .hci-dock-estimate.is-hidden { opacity: 0; visibility: hidden; transform: translateY(10px); pointer-events: none; }

        /* ---------- Centered section headings ---------- */
        .hci-page .hci-section-heading.is-centered { flex-direction: column; align-items: center; justify-content: center; gap: 0; margin-bottom: 54px; text-align: center; }
        .hci-page .hci-section-heading.is-centered h2 { max-width: 760px; margin: 12px auto 0; }

        /* ---------- Services: rounded cards, text and buttons aligned ---------- */
        .hci-services { padding-top: 92px; padding-bottom: 96px; }
        .hci-services-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
        .hci-service-card { position: relative; min-width: 0; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #ece5da; border-radius: 24px; background: #fff; transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .hci-service-card::after { content: ""; position: absolute; left: 0; bottom: 0; width: 0; height: 4px; background: linear-gradient(90deg, #ff914d, #ff783e); transition: width .4s ease; }
        .hci-service-card:hover, .hci-service-card:focus-within { transform: translateY(-8px); border-color: rgba(255,145,77,.6); box-shadow: 0 28px 54px rgba(35,39,34,.14); }
        .hci-service-card:hover::after, .hci-service-card:focus-within::after { width: 100%; }
        .hci-card-image { position: relative; height: 230px; display: block; overflow: hidden; background: #eee9e1; }
        .hci-card-image img { transition: transform .6s ease; }
        .hci-service-card:hover .hci-card-image img { transform: scale(1.08); }
        .hci-service-content { flex: 1; display: flex; flex-direction: column; padding: 24px 24px 26px; }
        .hci-card-number { color: #878c85; font-size: 11px; font-weight: 800; letter-spacing: .13em; }
        .hci-service-content h3 { min-height: 2.5em; margin: 10px 0; color: var(--hci-navy); font-size: 21px; line-height: 1.25; letter-spacing: -.035em; }
        .hci-service-content p { flex: 1; margin: 0 0 22px; color: var(--hci-muted); font-size: 14px; line-height: 1.75; }
        .hci-page .hci-service-content .hci-inline-link { margin-top: auto; font-size: 14px; }
        .hci-service-content .hci-inline-link svg { transition: transform .25s ease; }
        .hci-service-card:hover .hci-inline-link svg { transform: translateX(5px); }

        /* ---------- Room inspiration: bento layout, arch card, hover reveal ---------- */
        .hci-room-section { padding: 92px 0 100px; background: #f8f6f2; }
        .hci-room-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 250px; gap: 18px; }
        .hci-room-card-1 { grid-column: span 2; grid-row: span 2; }
        .hci-room-card-2 { grid-column: span 2; }
        .hci-page .hci-room-card { position: relative; display: block; overflow: hidden; isolation: isolate; border-radius: 28px; background: #e6dfd5; color: #fff; transition: transform .35s ease, box-shadow .35s ease; }
        .hci-page .hci-room-card-3 { border-radius: 150px 150px 28px 28px; }
        .hci-room-card:hover, .hci-room-card:focus-visible { transform: translateY(-6px); box-shadow: 0 28px 56px rgba(35,39,34,.22); }
        .hci-room-card img { transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
        .hci-room-card:hover img { transform: scale(1.08); }
        .hci-room-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(15,24,19,.86) 0%, rgba(15,24,19,.2) 55%, transparent 100%); }
        .hci-room-card-overlay { position: absolute; z-index: 1; left: 0; right: 0; bottom: 0; padding: 26px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        .hci-room-card-text { min-width: 0; text-shadow: 0 2px 12px rgba(0,0,0,.5); }
        .hci-room-label { display: block; margin-bottom: 6px; font-size: 13px; opacity: .92; }
        .hci-room-card-text h3 { margin: 0; color: #fff; font-size: clamp(22px, 2vw, 28px); line-height: 1.15; letter-spacing: -.04em; }
        .hci-room-card-1 .hci-room-card-text h3 { font-size: clamp(30px, 3vw, 42px); }
        .hci-room-more { display: block; max-height: 0; overflow: hidden; color: #ffc9a3; font-size: 14px; font-weight: 700; opacity: 0; transform: translateY(6px); transition: max-height .35s ease, margin .35s ease, opacity .35s ease, transform .35s ease; }
        .hci-room-card:hover .hci-room-more, .hci-room-card:focus-visible .hci-room-more { max-height: 28px; margin-top: 8px; opacity: 1; transform: none; }

        /* ---------- "Every room should earn its place": interactive story ---------- */
        .hci-story-section { display: grid; grid-template-columns: 1fr 1fr; background: #f8f6f2; }
        .hci-story-visual { position: relative; min-height: 700px; margin: 28px 0 28px 28px; overflow: hidden; border-radius: 32px; background: #e9e4dc; }
        .hci-story-visual::after { content: ""; position: absolute; inset: 0; z-index: 1; background: linear-gradient(0deg, rgba(15,24,19,.34), transparent 46%); pointer-events: none; }
        .hci-story-slide { position: absolute; inset: 0; opacity: 0; transform: scale(1.05); transition: opacity .7s ease, transform 1.1s ease; }
        .hci-story-slide.is-active { opacity: 1; transform: none; }
        .hci-story-tag { position: absolute; z-index: 2; left: 28px; bottom: 28px; display: inline-flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 999px; background: #fff; color: var(--hci-navy); font-size: 13px; }
        .hci-story-tag strong { font-weight: 750; animation: hciTagIn .45s ease; }
        @keyframes hciTagIn { from { opacity: 0; transform: translateY(6px); } }
        .hci-story-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--hci-orange); }
        .hci-story-copy { align-self: center; padding: 72px clamp(32px, 6vw, 96px); }
        .hci-story-title { margin: 14px 0 20px; color: var(--hci-navy); font-family: var(--hci-serif); font-size: clamp(38px, 4.2vw, 58px); font-weight: 500; line-height: 1.12; letter-spacing: -.02em; }
        .hci-story-word { display: inline-block; cursor: default; transition: font-weight .35s ease, color .35s ease, transform .35s ease; }
        .hci-story-word:hover { color: var(--hci-orange-deep); font-weight: 800; transform: translateY(-4px); }
        .hci-story-copy > p { max-width: 470px; margin: 0 0 26px; color: var(--hci-muted); font-size: 15px; line-height: 1.8; }
        .hci-story-points { display: grid; gap: 8px; margin: 0 0 30px; }
        .hci-story-point { width: 100%; display: flex; align-items: flex-start; gap: 16px; padding: 16px 18px; border: 1px solid transparent; border-radius: 18px; background: transparent; color: var(--hci-navy); text-align: left; cursor: pointer; transition: background .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s ease; }
        .hci-story-point:hover { background: rgba(255,255,255,.65); }
        .hci-story-point.is-active { border-color: rgba(255,145,77,.5); background: #fff; box-shadow: 0 16px 36px rgba(35,39,34,.09); transform: translateX(8px); }
        .hci-story-point-icon { width: 44px; height: 44px; flex: 0 0 44px; display: grid; place-items: center; border-radius: 50%; background: #fff0e6; color: var(--hci-orange-deep); transition: background .3s ease, color .3s ease; }
        .hci-story-point.is-active .hci-story-point-icon { background: var(--hci-orange); color: #fff; }
        .hci-story-point-body { flex: 1; min-width: 0; display: block; padding-top: 2px; }
        .hci-story-point-body strong { display: block; font-size: 16px; font-weight: 650; line-height: 1.45; }
        .hci-story-point-more { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s ease; }
        .hci-story-point.is-active .hci-story-point-more { grid-template-rows: 1fr; }
        .hci-story-point-more > span { min-height: 0; display: block; overflow: hidden; }
        .hci-story-point-text { display: block; padding-top: 8px; color: var(--hci-muted); font-size: 14px; line-height: 1.7; }
        .hci-story-actions { display: flex; flex-wrap: wrap; gap: 14px; }
        .hci-page .hci-story-actions .hci-button { min-height: 52px; padding: 0 24px; font-size: 15px; font-weight: 600; }

        /* ---------- Design ideas: rounded, staggered cards that tilt ---------- */
        .hci-inspiration-gallery { padding-top: 92px; padding-bottom: 96px; }
        .hci-gallery-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 22px; align-items: start; }
        .hci-page .hci-gallery-card { --s: 1; position: relative; display: block; height: 420px; overflow: hidden; border-radius: 32px; background: #e9e4dc; color: #fff; transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s)); transition: transform .25s ease-out, box-shadow .3s ease; will-change: transform; }
        .hci-gallery-card-2, .hci-gallery-card-4 { margin-top: 40px; }
        .hci-gallery-card:hover, .hci-gallery-card:focus-visible { --s: 1.025; box-shadow: 0 30px 60px rgba(20,30,25,.28); }
        .hci-gallery-card img { transition: transform .6s ease; }
        .hci-gallery-card:hover img { transform: scale(1.07); }
        .hci-gallery-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(20,30,25,.82), rgba(20,30,25,0) 62%); }
        .hci-gallery-glare { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.3), transparent 46%); opacity: 0; transition: opacity .3s ease; pointer-events: none; }
        .hci-gallery-card:hover .hci-gallery-glare { opacity: 1; }
        .hci-gallery-chip { position: absolute; z-index: 2; top: 18px; left: 18px; padding: 7px 14px; border: 1px solid rgba(255,255,255,.4); border-radius: 999px; background: rgba(255,255,255,.18); backdrop-filter: blur(10px); font-size: 12px; font-weight: 650; }
        .hci-gallery-caption { position: absolute; z-index: 2; left: 0; right: 0; bottom: 0; padding: 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; }
        .hci-gallery-caption h3 { margin: 0; color: #fff; font-size: 24px; line-height: 1.2; letter-spacing: -.03em; text-shadow: 0 2px 12px rgba(0,0,0,.45); }
        .hci-image-disclaimer { margin: 28px 0 0; color: #8a8b84; font-size: 12px; line-height: 1.6; text-align: right; }

        /* ---------- Tablet ---------- */
        @media (max-width: 1080px) {
          .hci-hero-inner { width: calc(100% - 44px); grid-template-columns: 1fr; gap: 36px; }
          .hci-hero-title { min-height: 3.3em; }
          .hci-lead-form { max-width: 680px; }
          .hci-services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hci-room-grid { grid-auto-rows: 240px; }
          .hci-room-card-1 { grid-row: span 1; }
          .hci-gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hci-story-section { grid-template-columns: 1fr; }
          .hci-story-visual { min-height: 440px; margin: 22px 22px 0; }
          .hci-story-copy { padding: 52px 28px 64px; }
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 760px) {
          .hci-page .hci-hero { padding: 28px 0 40px; }
          .hci-hero-inner { width: calc(100% - 32px); }
          .hci-hero-title { margin-bottom: 24px; font-size: clamp(32px, 9vw, 44px); }
          .hci-hero-areas, .hci-hero-points li { font-size: 15px; }
          .hci-page .hci-cta-row .hci-button { flex: 1 1 100%; }
          .hci-cta-row.is-centered { margin-top: 36px; }
          .hci-lead-form { padding: 22px 18px; border-radius: 20px; }
          .hci-page .hci-section-heading.is-centered { margin-bottom: 34px; }
          .hci-services { padding-top: 64px; padding-bottom: 64px; }
          .hci-card-image { height: 200px; }
          .hci-service-content h3 { min-height: 0; }
          .hci-room-section { padding: 64px 0 68px; }
          .hci-room-grid { grid-auto-rows: 260px; }
          .hci-room-card-1, .hci-room-card-2 { grid-column: span 2; }
          .hci-room-card-overlay { padding: 18px; }
          .hci-room-card-1 .hci-room-card-text h3 { font-size: 30px; }
          .hci-story-visual { min-height: 340px; margin: 16px 16px 0; border-radius: 24px; }
          .hci-story-tag { left: 16px; bottom: 16px; }
          .hci-story-copy { padding: 40px 16px 56px; }
          .hci-story-point.is-active { transform: none; }
          .hci-page .hci-story-actions .hci-button { flex: 1 1 100%; }
          .hci-inspiration-gallery { padding-top: 64px; padding-bottom: 64px; }
          .hci-gallery-card { height: 320px; }
          .hci-gallery-card-2, .hci-gallery-card-4 { margin-top: 22px; }
          .hci-gallery-caption h3 { font-size: 20px; }
          .hci-image-disclaimer { text-align: left; }
        }
        @media (max-width: 560px) {
          .hci-form-grid { grid-template-columns: 1fr; }
          .hci-services-grid { grid-template-columns: 1fr; }
          .hci-room-grid { grid-template-columns: 1fr; }
          .hci-room-card-1, .hci-room-card-2 { grid-column: span 1; }
          .hci-gallery-grid { grid-template-columns: 1fr; }
          .hci-gallery-card-2, .hci-gallery-card-4 { margin-top: 0; }
          .hci-page .hci-dock-estimate { min-height: 44px; padding: 0 18px; font-size: 14px; }
        }

        /* Touch screens have no hover, so keep the "View project" hint visible. */
        @media (hover: none) {
          .hci-room-more { max-height: 28px; margin-top: 8px; opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .hci-page .hci-gallery-card { transform: none !important; }
          .hci-story-slide { transform: none; }
        }

        /* Keep card titles white on photos */
.hci-page .hci-room-card .hci-room-card-text h3,
.hci-page .hci-gallery-card .hci-gallery-caption h3 { color: #fff !important; text-shadow: 0 2px 12px rgba(0,0,0,.55); }
.hci-page .hci-room-card .hci-room-label { color: #fff !important; }

/* Experience center cards: subtle hover */
.hci-page .hci-experience-card { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
.hci-page .hci-experience-card:hover { transform: translateY(-4px); border-color: #b7c7bd; box-shadow: 0 14px 30px rgba(35,39,34,.09); }
.hci-page .hci-experience-pin { transition: background .3s ease, color .3s ease, transform .3s ease; }
.hci-page .hci-experience-card:hover .hci-experience-pin { background: #fff0e6; color: #f57735; transform: scale(1.06); }

        /* Mobile-only carousels: desktop grids and their hover layouts stay untouched. */
        .hci-mobile-slider-shell { min-width: 0; width: 100%; }
        .hci-mobile-slider-controls { display: none; }

        @media (max-width: 760px) {
          .hci-mobile-slider-track {
            display: flex !important;
            grid-template-columns: none !important;
            grid-auto-flow: unset !important;
            grid-auto-rows: unset !important;
            align-items: stretch;
            gap: 14px !important;
            width: 100%;
            min-width: 0;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 2px 2px 8px;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            overscroll-behavior-x: contain;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .hci-mobile-slider-track::-webkit-scrollbar { display: none; }

          .hci-mobile-slider-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 14px;
            margin: 7px auto 0;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translateY(3px);
            transition: opacity .2s ease, transform .2s ease, visibility .2s ease;
          }
          .hci-mobile-slider-controls.is-visible {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: none;
          }
          .hci-mobile-slider-dot {
            width: 7px;
            height: 7px;
            flex: 0 0 7px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: #d7d5ce;
            cursor: pointer;
            transition: width .2s ease, background .2s ease;
          }
          .hci-mobile-slider-dot.is-active {
            width: 22px;
            flex-basis: 22px;
            background: #ff914d;
          }

          /* Services (screenshot 1): one full-width card per swipe. */
          .hci-mobile-slider-track.hci-services-grid { grid-auto-rows: unset; }
          .hci-mobile-slider-track .hci-service-card {
            flex: 0 0 100%;
            width: 100%;
            min-width: 0;
            scroll-snap-align: start;
          }
          .hci-mobile-slider-track .hci-service-card:hover,
          .hci-mobile-slider-track .hci-service-card:focus-within { transform: none; }

          /* Room inspiration (screenshot 2). */
          .hci-mobile-slider-track.hci-room-grid { grid-auto-rows: unset; }
          .hci-mobile-slider-track .hci-room-card {
            flex: 0 0 100%;
            width: 100%;
            height: 260px;
            min-width: 0;
            scroll-snap-align: start;
          }

          /* Ready-to-go / design inspiration gallery (screenshot 4). */
          .hci-mobile-slider-track.hci-gallery-grid { align-items: stretch; }
          .hci-mobile-slider-track .hci-gallery-card {
            flex: 0 0 100%;
            width: 100%;
            height: 320px;
            min-width: 0;
            margin-top: 0;
            transform: none;
            scroll-snap-align: start;
          }

          /* Experience centres (screenshot 5). */
          .hci-mobile-slider-track.hci-experience-grid { align-items: stretch; }
          .hci-mobile-slider-track .hci-experience-card {
            flex: 0 0 100%;
            width: 100%;
            min-width: 0;
            scroll-snap-align: start;
          }
          .hci-mobile-slider-track .hci-experience-card:hover { transform: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hci-mobile-slider-track { scroll-behavior: auto; }
          .hci-mobile-slider-controls,
          .hci-mobile-slider-dot { transition: none; }
        }

        /* ---------- Section headers: heading left, CTA right ---------- */
        .hci-page .hci-section-actions { display: flex; flex-shrink: 0; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 14px 22px; }
        .hci-page .hci-section-actions .hci-button { min-height: 54px; padding: 0 22px; font-size: 15px; font-weight: 600; white-space: nowrap; }
        .hci-page .hci-section-actions .hci-inline-link { white-space: nowrap; }
        .hci-page .hci-dock-estimate { border: 0; cursor: pointer; font-family: inherit; }
        /* Cards are display-only now. */
        .hci-page .hci-service-card, .hci-page .hci-room-card, .hci-page .hci-gallery-card, .hci-page .hci-location-card { cursor: default; }
        .hci-page button.hci-see-center-button { cursor: pointer; font-family: inherit; }
        @media (max-width: 760px) {
          .hci-page .hci-section-actions { width: 100%; justify-content: flex-start; }
          .hci-page .hci-section-actions .hci-button { flex: 1 1 auto; }
        }

        /* ---------- Consultation pop-up ---------- */
        .hci-popup-overlay { position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15,24,19,.62); backdrop-filter: blur(3px); animation: hciPopFade .2s ease; }
        .hci-popup-box { position: relative; width: min(540px, 100%); max-height: calc(100vh - 40px); max-height: calc(100dvh - 40px); overflow-y: auto; border-radius: 24px; background: #fff; box-shadow: 0 40px 90px rgba(0,0,0,.35); animation: hciPopIn .25s ease; }
        .hci-popup-box .hci-lead-form { max-width: none; border: 0; border-radius: 0; box-shadow: none; }
        .hci-popup-box .hci-form-heading { padding-right: 36px; }
        .hci-popup-box { scrollbar-width: none; }
        .hci-popup-box::-webkit-scrollbar { display: none; }
        .hci-popup-close { position: absolute; top: 14px; right: 14px; z-index: 2; width: 38px; height: 38px; display: grid; place-items: center; padding: 0 0 3px; border: 0; border-radius: 50%; background: #f3f0ea; color: #232722; font-size: 26px; line-height: 1; cursor: pointer; transition: background .2s ease, color .2s ease; }
        .hci-popup-close:hover { background: var(--hci-orange); color: #fff; }
        @keyframes hciPopFade { from { opacity: 0; } }
        @keyframes hciPopIn { from { opacity: 0; transform: translateY(14px) scale(.98); } }
        @media (max-width: 560px) {
          .hci-popup-overlay { padding: 12px; }
          .hci-popup-box { border-radius: 20px; max-height: calc(100dvh - 24px); }
        }

        /* ---------- Mobile buttons: short, pill-shaped ---------- */
        @media (max-width: 760px) {
          .hci-page .hci-button,
          .hci-page .hci-button-primary,
          .hci-page .hci-button-ghost,
          .hci-page .hci-directions-button,
          .hci-page .hci-see-center-button { border-radius: 999px; }
          .hci-page .hci-button { min-height: 42px; padding: 0 20px; font-size: 14px; }
          .hci-page .hci-cta-row { gap: 10px; }
          .hci-page .hci-cta-row .hci-button { flex: 1 1 150px; min-height: 42px; padding: 0 16px; font-size: 14px; }
          .hci-page .hci-section-actions .hci-button { flex: 1 1 100%; min-height: 42px; font-size: 14px; }
          .hci-page .hci-story-actions .hci-button { flex: 1 1 100%; min-height: 42px; padding: 0 20px; font-size: 14px; }
          .hci-page .hci-submit { min-height: 46px; margin-top: 14px; font-size: 15px; }
          .hci-page .hci-directions-button, .hci-page .hci-see-center-button { min-height: 40px; }
          .hci-page .hci-dock-estimate { min-height: 40px; padding: 0 18px; font-size: 14px; }
        }

        /* ---------- Phone number chip in the final banner (matches the button colour) ---------- */
        .hci-page .hci-phone-link { min-height: 48px; padding: 0 20px; border-radius: 12px; background: linear-gradient(90deg, #ff914d 0%, #ff783e 100%); color: #fff !important; font-size: 14px; font-weight: 700; box-shadow: 0 8px 20px rgba(255,145,77,.22); transition: transform .2s ease, box-shadow .2s ease; }
        .hci-page .hci-phone-link:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,126,62,.3); }

        /* Bottom CTA exists only for the mobile layout. */
        .hci-page .hci-section-actions-bottom { display: none; }

        /* ---------- Mobile: centred headings, CTA below each section ---------- */
        @media (max-width: 760px) {
          .hci-page .hci-section-heading,
          .hci-page .hci-process-inner .hci-section-heading { align-items: center; text-align: center; }
          .hci-page .hci-section-heading .hci-section-actions { display: none; }
          .hci-page .hci-section-actions-bottom { display: flex; margin-top: 26px; }
          .hci-page .hci-property-intro { text-align: center; }
          .hci-page .hci-experience-heading { margin-left: auto; margin-right: auto; text-align: center; }
          .hci-page .hci-experience-heading p { margin: 4px auto 0; }
          .hci-page .hci-locations-intro { text-align: center; }
          .hci-page .hci-locations-intro p { margin: 0 auto; }
          .hci-page .hci-phone-link { min-height: 42px; padding: 0 18px; border-radius: 999px; }
        }

        /* ---------- Mobile: centred FAQ + final banner, both buttons on one row ---------- */
        @media (max-width: 760px) {
          .hci-page .hci-faq-intro { text-align: center; }
          .hci-page .hci-faq-intro > p { margin: 0 auto; }
          .hci-page .hci-final-cta-copy { text-align: center; }
          .hci-page .hci-final-cta-copy > p { margin: 0 auto; }
          .hci-page .hci-final-actions { flex-wrap: wrap; justify-content: center; gap: 8px; }
          .hci-page .hci-final-actions .hci-button { gap: 6px; padding: 0 12px; font-size: 12.5px; white-space: nowrap; }
          .hci-page .hci-final-actions .hci-button-icon { width: 20px; height: 20px; flex-basis: 20px; }
          .hci-page .hci-final-actions .hci-button-icon svg { width: 11px; height: 11px; }
          .hci-page .hci-final-actions .hci-phone-link { gap: 6px; padding: 0 12px; font-size: 12.5px; white-space: nowrap; }
        }

        /* ---------- Mobile: keep both final-banner buttons on ONE row on every phone (iPhone + Android) ---------- */
        @media (max-width: 760px) {
          .hci-page .hci-final-cta-copy { padding-left: 16px; padding-right: 16px; }
          .hci-page .hci-final-actions { flex-wrap: nowrap; justify-content: center; gap: 8px; }
          .hci-page .hci-final-actions .hci-button,
          .hci-page .hci-final-actions .hci-phone-link {
            flex: 0 1 auto; min-width: 0; gap: 5px;
            padding: 0 clamp(8px, 2.8vw, 12px);
            font-size: clamp(10.5px, 3.2vw, 12.5px);
          }
        }
        @media (max-width: 340px) {
          .hci-page .hci-final-actions .hci-button-icon { display: none; }
        }


        /* ---------- Home type selector: theme follows the mouse ---------- */
        .hci-page .hci-property-option { cursor: pointer; }
        .hci-page .hci-property-option:hover { background: var(--hci-orange); border-color: var(--hci-orange); color: #fff; box-shadow: 0 7px 17px rgba(255,145,77,.18); transform: translateY(-2px); }
        .hci-page .hci-property-options:hover .hci-property-option.is-selected:not(:hover) { background: #fff; border-color: #e2dbd1; color: var(--hci-navy); box-shadow: none; }

        /* ---------- Process steps: hover effect ---------- */
        .hci-page .hci-process-step { position: relative; cursor: default; transition: transform .3s ease; }
        .hci-page .hci-process-step:hover { transform: translateY(-6px); }
        .hci-page .hci-process-marker span { transition: background .3s ease, color .3s ease, transform .3s ease, box-shadow .3s ease; }
        .hci-page .hci-process-step:hover .hci-process-marker span { background: var(--hci-orange); color: #fff; transform: scale(1.12); box-shadow: 0 8px 18px rgba(255,145,77,.38); }
        .hci-page .hci-process-step .hci-process-marker i { transition: background .3s ease; }
        .hci-page .hci-process-step:hover .hci-process-marker i { background: var(--hci-orange); }
        .hci-page .hci-process-step h3 { transition: color .3s ease; }
        .hci-page .hci-process-step:hover h3 { color: var(--hci-orange-deep); }

        /* ---------- Experience centers: four cards ---------- */
        @media (min-width: 1200px) {
          .hci-page .hci-experience-grid { grid-template-columns: repeat(4, minmax(0,1fr)); gap: 20px; }
          .hci-page .hci-experience-content { padding: 26px 22px 24px; }
          .hci-page .hci-experience-content h3 { font-size: 28px; }
          .hci-page .hci-experience-content p { min-height: 140px; font-size: 15px; }
          .hci-page .hci-directions-button, .hci-page .hci-see-center-button { min-height: 44px; padding: 0 15px; font-size: 14px; }
        }
        @media (min-width: 761px) and (max-width: 1199px) {
          .hci-page .hci-experience-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
          .hci-page .hci-experience-content p { min-height: 0; }
        }



        /* ---------- Header: full width, logo at the far left ---------- */
        .hci-header { position: fixed; top: 0; left: 0; right: 0; z-index: 70; height: 88px; background: rgba(255,255,255,.97); backdrop-filter: blur(10px); border-bottom: 1px solid #eee9e1; box-shadow: 0 4px 18px rgba(35,39,34,.05); }
        .hci-header-spacer { height: 88px; }
        .hci-header-inner { width: 100%; height: 100%; margin: 0; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .hci-page .hci-header-logo { padding: 0; border: 0; background: none; cursor: pointer; display: inline-flex; align-items: center; }
        .hci-page .hci-header-logo img { width: auto; height: 66px; object-fit: contain; }
        .hci-page .hci-header-cta { min-height: 48px; padding: 0 26px; font-size: 15px; font-weight: 600; white-space: nowrap; }

        /* ---------- Slider arrows (mobile only) ---------- */
        .hci-mobile-slider-frame { position: relative; }
        .hci-mobile-slider-arrow { display: none; }
        .hci-location-group { display: contents; }

        @media (max-width: 760px) {
          .hci-header, .hci-header-spacer { height: 68px; }
          .hci-header-inner { padding: 0 14px; }
          .hci-page .hci-header-logo img { height: 50px; }
          .hci-page .hci-header-cta { min-height: 40px; padding: 0 18px; font-size: 13px; }

          .hci-page .hci-mobile-slider-arrow { position: absolute; top: 50%; z-index: 3; width: 34px; height: 34px; margin-top: -17px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 50%; background: #fff; color: #232722; box-shadow: 0 6px 16px rgba(0,0,0,.24); cursor: pointer; transition: background .2s ease, color .2s ease; }
          .hci-page .hci-mobile-slider-arrow:active { background: #ff914d; color: #fff; }
          .hci-page .hci-mobile-slider-arrow.is-prev { left: -14px; }
          .hci-page .hci-mobile-slider-arrow.is-prev svg { transform: rotate(180deg); }
          .hci-page .hci-mobile-slider-arrow.is-next { right: -14px; }

          /* Room inspiration: the arch card becomes a rounded square like the others. */
          .hci-page .hci-room-card-3 { border-radius: 28px; }

          /* Serving areas: slides of 2 x 2 cards. */
          .hci-page .hci-mobile-slider-track .hci-location-group { flex: 0 0 100%; width: 100%; min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; align-content: start; scroll-snap-align: start; }
          .hci-page .hci-location-group .hci-location-card { min-height: 66px; padding: 10px; gap: 8px; border-radius: 14px; }
          .hci-page .hci-location-group .hci-location-card-icon { width: 34px; height: 34px; flex-basis: 34px; }
          .hci-page .hci-location-group .hci-location-card-icon svg { width: 18px; height: 18px; }
          .hci-page .hci-location-group .hci-location-card-copy strong { font-size: 15px; line-height: 1.25; }

          /* Floating buttons: Get Design Quote becomes a bar at the bottom, WhatsApp / call sit above it. */
          .hci-dock { transition: bottom .25s ease; }
          .hci-dock.has-bar { bottom: 78px; }
          .hci-page .hci-dock-estimate { position: fixed; left: 14px; right: 14px; bottom: 14px; width: auto; min-height: 50px; padding: 0 18px; justify-content: center; font-size: 15px; border-radius: 999px; }
          .hci-page .hci-final-cta-copy { padding-bottom: 90px; }
        }


        /* ---------- Hero headline: height follows the text ---------- */
        .hci-page .hci-hero-title { min-height: 0; margin-bottom: 24px; }
        .hci-hero-typed { display: grid; }
        .hci-hero-sizer, .hci-hero-live { grid-area: 1 / 1; }
        .hci-hero-sizer { visibility: hidden; pointer-events: none; }

        /* ---------- Floating quote button label ---------- */
        .hci-dock-label-mobile { display: none; }
        @media (max-width: 760px) {
          .hci-dock-label-desktop { display: none; }
          .hci-dock-label-mobile { display: inline; }
        }

        /* ---------- Experience cards: compact, address / phone / buttons aligned (desktop + tablet) ---------- */
        @media (min-width: 761px) {
          .hci-page .hci-experience-content { padding: 22px 22px 22px; }
          .hci-page .hci-experience-pin { width: 44px; height: 44px; margin-bottom: 14px; }
          .hci-page .hci-experience-content h3 { font-size: 27px; }
          .hci-page .hci-experience-content p { flex: 1 1 auto; min-height: 0; margin: 0 0 12px; font-size: 14.5px; line-height: 1.6; }
          .hci-page .hci-experience-phone { margin-bottom: 16px; }
        }


        /* ---------- Mobile hero: headline reserves only two lines, so the gap stays small ---------- */
        @media (max-width: 760px) {
          .hci-hero-sizer { display: none; }
          .hci-page .hci-hero-title { min-height: 2.2em; margin-bottom: 14px; }
        }

`;

export default function HCILandingPage() {
  const [homeType, setHomeType] = useState("1 BHK");
  const [openFaq, setOpenFaq] = useState(0);
  const [statValues, setStatValues] = useState([0, 0, 0, 0]);
  const [formInView, setFormInView] = useState(true);
  const [popup, setPopup] = useState({ open: false, ctaText: "Schedule a Design Consultation" });
  const statsRef = useRef(null);
  const formRef = useRef(null);
  const pageRef = useRef(null);
  const typedText = useTypewriter(heroPhrases);

  useEffect(() => {
    const statsNode = statsRef.current;
    if (!statsNode || typeof IntersectionObserver === "undefined") return undefined;

    let animationFrame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const startTime = performance.now();
      const duration = 1500;
      const targets = [8, 2750, 450, 5];
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setStatValues(targets.map((target) => Math.round(target * easedProgress)));
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }, { threshold: 0.25 });

    observer.observe(statsNode);
    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Show the floating "Get Design Quote" pill only while the top form is off screen.
  useEffect(() => {
    const formNode = formRef.current;
    if (!formNode || typeof IntersectionObserver === "undefined") {
      setFormInView(false);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(formNode);
    return () => observer.disconnect();
  }, []);

  // public/style.css adds top margin/padding around the page. Override it with inline !important styles.
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const touched = [];
    const zero = (element, property) => {
      touched.push([element, property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
      element.style.setProperty(property, "0px", "important");
    };

    const clearTopSpace = () => {
      let element = page;
      while (element && element !== document.documentElement) {
        const computed = window.getComputedStyle(element);
        const marginTop = parseFloat(computed.marginTop) || 0;
        const paddingTop = parseFloat(computed.paddingTop) || 0;
        if (marginTop > 0 && marginTop <= 160) zero(element, "margin-top");
        if (paddingTop > 0 && paddingTop <= 160) zero(element, "padding-top");
        element = element.parentElement;
      }
    };

    clearTopSpace();
    const settleTimer = setTimeout(clearTopSpace, 400);
    return () => {
      clearTimeout(settleTimer);
      touched.reverse().forEach(([element, property, value, priority]) => {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      });
    };
  }, []);

  const openForm = (ctaText = "Get Design Quote") => setPopup({ open: true, ctaText });
  const closeForm = useCallback(() => setPopup((current) => ({ ...current, open: false })), []);

  // Same button everywhere: heading on the left, this CTA on the right, form opens as a pop-up.
  const estimateButton = (
    <button type="button" className="hci-button hci-button-primary" onClick={() => openForm("Get Design Quote")}>
      Get Design Quote
    </button>
  );

  const goToEstimator = (type) => {
    setHomeType(type);
    const url = `${ESTIMATOR_PATH}?homeType=${encodeURIComponent(type)}`;
    // Desktop: open the estimator in a new tab so the landing page stays open. Mobile: same tab.
    const isDesktop = typeof window.matchMedia === "function" && window.matchMedia("(min-width: 761px)").matches;
    if (isDesktop) {
      // "noopener" makes window.open return null even on success, so its result is not checked.
      window.open(url, "_blank", "noopener");
      return;
    }
    window.location.href = url;
  };

  return (
    <main className="hci-page" ref={pageRef}>
      {/* Page CSS is rendered as a normal <style> tag so it ships inside the server HTML.
          (styled-jsx only injected it after hydration, which caused the unstyled flash on load.) */}
      <style dangerouslySetInnerHTML={{ __html: HCI_PAGE_CSS }} />

      {/* Display serif used for the "Every room should earn its place" headline. Falls back to Georgia. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
      />

      {/* HEADER: logo left, Get Design Quote right. Both open the consultation pop-up. */}
      <header className="hci-header">
        <div className="hci-header-inner">
          <button type="button" className="hci-header-logo" onClick={() => openForm("Get Design Quote")} aria-label="High Creation Interior – open the consultation form">
            <img src="/images/new_hc_logo.png" alt="High Creation Interior" />
          </button>
          <button type="button" className="hci-button hci-button-primary hci-header-cta" onClick={() => openForm("Get Design Quote")}>
            Get Design Quote
          </button>
        </div>
      </header>
      <div className="hci-header-spacer" aria-hidden="true" />

      {/* HERO: typing headline + consultation form at the very top */}
      <section className="hci-hero" id="top">
        <div className="hci-hero-bg" aria-hidden="true">
          <img src={images.planning} alt="" fetchPriority="high" />
        </div>
        <div className="hci-hero-inner">
          <div className="hci-hero-copy">
            <h1 className="hci-hero-title">
              <span className="hci-sr-only">Creating better homes: interior design with complete customization and in-house production across Delhi NCR</span>
              {/* Hidden copies of every phrase reserve exactly the height of the longest one,
                  so the gap under the headline matches the text instead of a fixed minimum. */}
              <span className="hci-hero-typed" aria-hidden="true">
                {heroPhrases.map((phrase) => (
                  <span className="hci-hero-sizer" key={phrase}>{phrase}</span>
                ))}
                <span className="hci-hero-live">{typedText}<span className="hci-caret" /></span>
              </span>
            </h1>
            <p className="hci-hero-areas">
              <Icon name="pin" size={19} />
              <span>Our Interior Design services available in Gurugram, Noida, Ghaziabad, Faridabad, Noida Extension, Manesar and Sohna.</span>
            </p>
            <ul className="hci-hero-points">
              {heroPoints.map((item) => (
                <li key={item}><span><Icon name="check" size={14} /></span>{item}</li>
              ))}
            </ul>
            <CtaRow />
          </div>
          <div className="hci-hero-formwrap" id="consultation" ref={formRef}>
            <LeadForm />
          </div>
        </div>
      </section>

      <section className="hci-benefits" aria-label="HC Interior approach">
        <div className="hci-benefit">
          <span className="hci-icon-wrap"><Icon name="person" /></span>
          <div><h2>Designed around you</h2><p>Your lifestyle, preferences and space lead every design decision.</p></div>
        </div>
        <div className="hci-benefit">
          <span className="hci-icon-wrap"><Icon name="palette" /></span>
          <div><h2>Material choices made clear</h2><p>Explore finishes, textures and combinations with guidance.</p></div>
        </div>
        <div className="hci-benefit">
          <span className="hci-icon-wrap"><Icon name="home" /></span>
          <div><h2>From concept to handover</h2><p>A considered process from the first discussion to the final review.</p></div>
        </div>
      </section>

      <section className="hci-property-strip" id="spaces">
        <div className="hci-section-intro hci-property-intro">
          <span className="hci-eyebrow">A HOME THAT FITS YOUR LIFE</span>
          <h2>Find the right design<br className="hci-desktop-only" /> for your space.</h2>
        </div>
        <div className="hci-property-options" aria-label="Choose your home type">
          {["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa"].map((type) => (
            <button
              className={`hci-property-option${homeType === type ? " is-selected" : ""}`}
              type="button"
              key={type}
              onClick={() => goToEstimator(type)}
              aria-pressed={homeType === type}
            >
              <Icon name={type === "Villa" ? "home" : "layers"} size={20} />
              <span>{type}</span>
            </button>
          ))}
        </div>
        <p className="hci-property-hint">Choose a home type to continue to the home estimator.</p>
      </section>

      {/* SERVICES: heading left, CTA right; cards are display-only (no links) */}
      <section className="hci-section hci-services" id="services">
        <div className="hci-section-heading">
          <div><span className="hci-eyebrow">WHAT WE OFFER</span><h2>Good design is in the details.</h2></div>
          <div className="hci-section-actions">{estimateButton}</div>
        </div>
        <MobileCardSlider className="hci-services-grid" label="Services">
          {services.map((service) => (
            <article className="hci-service-card" key={service.number}>
              <div className="hci-card-image">
                <img src={service.image} alt={`${service.title} design inspiration`} loading="lazy" />
              </div>
              <div className="hci-service-content">
                <span className="hci-card-number">{service.number} / SERVICE</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </div>
            </article>
          ))}
        </MobileCardSlider>
        <div className="hci-section-actions hci-section-actions-bottom">{estimateButton}</div>
      </section>

      {/* ROOM INSPIRATION: heading left, CTA right; cards are display-only (no links) */}
      <section className="hci-room-section" id="inspiration">
        <div className="hci-section hci-room-inner">
          <div className="hci-section-heading">
            <div><span className="hci-eyebrow">ROOM INSPIRATION</span><h2>Beautiful spaces, thoughtfully imagined.</h2></div>
            <div className="hci-section-actions">
              {estimateButton}
            </div>
          </div>
          <MobileCardSlider className="hci-room-grid" label="Room inspiration">
            {roomIdeas.map((room, index) => (
              <div className={`hci-room-card hci-room-card-${index + 1}`} key={room.title}>
                <img src={room.image} alt={`${room.title} interior design inspiration`} loading="lazy" />
                <div className="hci-room-card-overlay">
                  <div className="hci-room-card-text">
                    <span className="hci-room-label">{room.label}</span>
                    <h3>{room.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </MobileCardSlider>
          <div className="hci-section-actions hci-section-actions-bottom">{estimateButton}</div>
        </div>
      </section>

      <StorySection onEstimate={() => openForm("Get Design Quote")} />

      <section className="hci-process-section" id="process">
        <div className="hci-section hci-process-inner">
          <div className="hci-section-heading">
            <div><span className="hci-eyebrow">OUR PROCESS</span><h2>A simple, well-planned journey.</h2></div>
            <div className="hci-section-actions">
              {estimateButton}
            </div>
          </div>
          <div className="hci-process-grid">
            {processSteps.map((step, index) => (
              <article className="hci-process-step" key={step.number}>
                <div className="hci-process-marker"><span>{step.number}</span>{index < processSteps.length - 1 ? <i /> : null}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="hci-process-footnote"><Icon name="check" size={17} /> Specific scope, quotation, materials and timings are discussed for each project before work proceeds.</div>
          <div className="hci-section-actions hci-section-actions-bottom">{estimateButton}</div>
        </div>
      </section>

      <section className="hci-stats" ref={statsRef} aria-label="HC Interior at a glance">
        <div className="hci-stats-inner">
          <div className="hci-stat"><strong>{statValues[0]}+</strong><span>years of experience</span></div>
          <div className="hci-stat"><strong>{statValues[1].toLocaleString("en-IN")}+</strong><span>projects completed</span></div>
          <div className="hci-stat"><strong>{statValues[2]}+</strong><span>people on our team</span></div>
          <div className="hci-stat"><strong>{statValues[3]}</strong><span>branches across NCR</span></div>
        </div>
      </section>

      {/* DESIGN IDEAS: heading left, CTA right; cards are display-only (no links) */}
      <section className="hci-section hci-inspiration-gallery">
        <div className="hci-section-heading">
          <div><span className="hci-eyebrow">DESIGN IDEAS</span><h2>Real life is the inspiration.</h2></div>
          <div className="hci-section-actions">
            {estimateButton}
          </div>
        </div>
        <MobileCardSlider className="hci-gallery-grid" label="Design ideas">
          {inspirationCards.map((card, index) => (
            <TiltCard className={`hci-gallery-card hci-gallery-card-${index + 1}`} key={card.title}>
              <img src={card.image} alt={`${card.title} interior inspiration`} loading="lazy" />
              <span className="hci-gallery-glare" aria-hidden="true" />
              <span className="hci-gallery-chip">{card.category}</span>
              <div className="hci-gallery-caption">
                <h3>{card.title}</h3>
              </div>
            </TiltCard>
          ))}
        </MobileCardSlider>
        <div className="hci-section-actions hci-section-actions-bottom">{estimateButton}</div>
      </section>

      <section className="hci-experience-section" id="experience-centres" aria-labelledby="hci-experience-title">
        <div className="hci-section hci-experience-inner">
          <div className="hci-experience-heading">
            <h2 id="hci-experience-title">Visit an experience center<br className="hci-desktop-only" /> near you</h2>
            <p>Walk through finished rooms, feel the materials and talk to a designer in person.</p>
          </div>
          <MobileCardSlider className="hci-experience-grid" label="Experience centers">
            {experienceCenters.map((center) => (
              <article className="hci-experience-card" key={center.city}>
                <div className="hci-experience-content">
                  <span className="hci-experience-pin"><Icon name="pin" size={21} /></span>
                  <h3>{center.city}</h3>
                  <span className="hci-experience-kicker">Experience center</span>
                  <p>{center.address}</p>
                  <a className="hci-experience-phone" href={`tel:${center.telephone}`}>{center.phone}</a>
                  <div className="hci-experience-actions">
                    <a
                      className="hci-directions-button"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >Get directions</a>
                    <button type="button" className="hci-see-center-button" onClick={() => openForm("Schedule visit")}>Schedule visit</button>
                  </div>
                </div>
              </article>
            ))}
          </MobileCardSlider>
        </div>
      </section>

      <section className="hci-locations-section" id="serving-areas" aria-labelledby="hci-serving-title">
        <div className="hci-section hci-locations-inner">
          <div className="hci-locations-intro">
            <span className="hci-eyebrow">SERVING DELHI NCR</span>
            <h2 id="hci-serving-title">Thoughtful interiors,<br />closer to home.</h2>
            <p>Connect with HC Interior for design guidance across Delhi NCR. Choose your city to explore local services.</p>
          </div>
          <MobileCardSlider className="hci-location-grid" label="Serving areas">
            {locationGroups.map((group, groupIndex) => (
              <div className="hci-location-group" key={`areas-${groupIndex}`}>
                {group.map((location) => (
                  <div className="hci-location-card" key={location.city}>
                    <span className="hci-location-card-icon"><Icon name="pin" size={22} /></span>
                    <span className="hci-location-card-copy"><strong>{location.city}</strong></span>
                  </div>
                ))}
              </div>
            ))}
          </MobileCardSlider>
        </div>
      </section>

      <section className="hci-section hci-faq-section">
        <div className="hci-faq-intro"><span className="hci-eyebrow">GOOD TO KNOW</span><h2>Questions before<br />you begin?</h2><p>Here are a few useful details about designing with HC Interior.</p></div>
        <div className="hci-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <article className={`hci-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
                <h3>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{faq.question}</span><span className="hci-faq-toggle">{isOpen ? "−" : "+"}</span>
                  </button>
                </h3>
                {isOpen ? <p>{faq.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="hci-final-cta" id="contact">
        <div className="hci-final-cta-image"><img src={images.dining} alt="Bright dining and living interior inspiration" loading="lazy" /></div>
        <div className="hci-final-cta-copy"><span className="hci-eyebrow">THE FIRST STEP IS A CONVERSATION</span><h2>Let’s plan a home<br />that works for you.</h2><p>Share your space, your ideas and what matters most. Start a discussion with HC Interior.</p><div className="hci-final-actions"><button type="button" className="hci-button hci-button-primary" onClick={() => openForm("Book a consultation")}>Book a consultation <span className="hci-button-icon"><Icon name="phone-call" size={14} /></span></button><a className="hci-phone-link" href="tel:+919810506301"><Icon name="phone" size={17} /> {CONTACT_DISPLAY}</a></div></div>
      </section>

      <FloatingDock showEstimate={!formInView} onEstimate={() => openForm("Get Design Quote")} />
      <LeadPopup open={popup.open} ctaText={popup.ctaText} onClose={closeForm} />
    </main>
  );
}
