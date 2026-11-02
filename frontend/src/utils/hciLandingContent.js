// // Single source of truth for the /design-your-dream-space landing page.
// // - The public page renders DEFAULT_CONTENT merged with whatever the CMS saved (GET /cms-landing-page/design-your-dream-space).
// // - The CMS editor starts from the same merged object, so every field is pre-filled with the live text.
// // Arrays saved from the CMS REPLACE the default arrays (that is what makes "delete" work).

// export const PAGE_KEY = "design-your-dream-space";

// export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// export const ICON_NAMES = ["person", "layers", "home", "palette", "pin", "phone", "phone-call", "chat", "check", "sparkle"];

// export const safeHeadingTag = (tag, fallback = "h2") => (HEADING_TAGS.includes(tag) ? tag : fallback);
// export const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");
// // 10 digits -> add the India country code; anything longer is used as typed (digits only).
// export const toDialNumber = (value) => {
//   const digits = digitsOnly(value);
//   return digits.length === 10 ? `91${digits}` : digits;
// };

// const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

// export function mergeContent(base, saved) {
//   if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
//   if (isPlainObject(base)) {
//     const source = isPlainObject(saved) ? saved : {};
//     const out = {};
//     Object.keys(base).forEach((key) => {
//       out[key] = key in source ? mergeContent(base[key], source[key]) : base[key];
//     });
//     Object.keys(source).forEach((key) => {
//       if (!(key in out)) out[key] = source[key];
//     });
//     return out;
//   }
//   return saved === undefined || saved === null ? base : saved;
// }

// const IMG = {
//   hero: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618437357-424701680.png",
//   planning: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
//   custom: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618439213-81831281.png",
//   furniture: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779626359913-930967107.png",
//   kitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
//   living: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624540042-958249945.jpg",
//   details: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779874067164-110566752.png",
//   dining: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618591342-113150251.png",
//   luxuryKitchen: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779619195690-775248541.png",
//   readyLiving: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
//   readyKitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
//   readyBedroom: "https://apidev.hcinterior.in/uploads/parent-child/image-1742645786915-419668135.jpg",
//   readyBalcony: "https://apidev.hcinterior.in/uploads/parent-child/image-1737288595592-330954825.jpg",
// };

// const h = (text, tag) => ({ text, tag });

// export const DEFAULT_CONTENT = {
//   contact: {
//     callNumber: "+91 70707 01373",
//     whatsappNumber: "+91 70707 01373",
//     whatsappGreeting: "Hello HC Interior, I would like to discuss an interior design enquiry.",
//   },
//   buttons: {
//     getQuote: "Get Design Quote",
//     getQuoteMobile: "Let’s Get Started",
//     call: "Call",
//     whatsapp: "Chat on WhatsApp",
//     directions: "Get directions",
//     scheduleVisit: "Schedule visit",
//     bookConsultation: "Book a consultation",
//   },
//   header: {
//     logo: "/images/new_hc_logo.png",
//     logoAlt: "High Creation Interior",
//   },
//   form: {
//     heading: h("Get a free design consultation", "h2"),
//     submitText: "Schedule a Design Consultation",
//   },
//   hero: {
//     heading: h(
//       "Creating better homes: interior design with complete customization and in-house production across Delhi NCR",
//       "h1"
//     ),
//     phrases: [
//       "Complete customization for every corner of your home.",
//       "In-house production, crafted with care.",
//       "Free design consultation to plan your next step.",
//       "A better home starts with a clear plan.",
//     ],
//     image: IMG.planning,
//     areasText:
//       "Our Interior Design services available in Delhi, Gurugram, Noida, Ghaziabad, Faridabad, Noida Extension, Manesar and Sohna.",
//     points: ["Free design consultation", "Complete customization", "In-house production"],
//   },
//   benefits: {
//     visible: true,
//     items: [
//       { icon: "person", title: h("Designed around you", "h2"), text: "Your lifestyle, preferences and space lead every design decision." },
//       { icon: "palette", title: h("Material choices made clear", "h2"), text: "Explore finishes, textures and combinations with guidance." },
//       { icon: "home", title: h("From concept to handover", "h2"), text: "A considered process from the first discussion to the final review." },
//     ],
//   },
//   propertyStrip: {
//     visible: true,
//     eyebrow: "A HOME THAT FITS YOUR LIFE",
//     heading: h("Find the right design\nfor your space.", "h2"),
//     options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa"],
//     hint: "Choose a home type to continue to the home estimator.",
//   },
//   services: {
//     visible: true,
//     eyebrow: "WHAT WE OFFER",
//     heading: h("Good design is in the details.", "h2"),
//     cardLabel: "SERVICE",
//     items: [
//       {
//         title: h("Interior Design & Planning", "h3"),
//         text: "Layouts, design concepts and material choices shaped around your space, preferences and everyday routine.",
//         image: IMG.planning,
//       },
//       {
//         title: h("Custom Interior Design", "h3"),
//         text: "Personalised interiors and made-for-you solutions that bring style, comfort and functionality together.",
//         image: IMG.custom,
//       },
//       {
//         title: h("Furniture & Décor", "h3"),
//         text: "Furniture, finishes and thoughtful details selected to complement the character of your home.",
//         image: IMG.furniture,
//       },
//       {
//         title: h("Kitchen Interior Design", "h3"),
//         text: "Practical, well-planned kitchens designed around storage, workflow and the way you cook.",
//         image: IMG.kitchen,
//       },
//     ],
//   },
//   rooms: {
//     visible: true,
//     eyebrow: "ROOM INSPIRATION",
//     heading: h("Beautiful spaces, thoughtfully imagined.", "h2"),
//     items: [
//       { title: h("Kitchen", "h3"), label: "Premium modular kitchen", image: IMG.luxuryKitchen },
//       { title: h("Living Room", "h3"), label: "Considered luxury living", image: IMG.hero },
//       { title: h("Master Bedroom", "h3"), label: "A restful premium retreat", image: IMG.details },
//       { title: h("Wardrobe & Storage", "h3"), label: "Bespoke wardrobe details", image: IMG.furniture },
//     ],
//   },
//   story: {
//     visible: true,
//     eyebrow: "A MORE CONSIDERED HOME",
//     heading: h("Every room should earn its place.", "h2"),
//     text: "A beautiful interior does more than look good. It brings together movement, storage, materials and comfort so your home works well in everyday life.",
//     tagLabel: "Idea to interior",
//     points: [
//       {
//         short: "Layouts",
//         icon: "layers",
//         title: "Layouts informed by your space and routines",
//         text: "Movement, storage and furniture placement are planned around how each room is actually used day to day.",
//         image: IMG.living,
//         alt: "Living room layout with comfortable seating, natural light and warm finishes",
//       },
//       {
//         short: "Finishes",
//         icon: "palette",
//         title: "Finishes and furniture chosen with intention",
//         text: "Materials, textures and furniture are selected together so the room feels cohesive rather than assembled.",
//         image: IMG.furniture,
//         alt: "Wardrobe and storage interior with warm wood finishes and layered lighting",
//       },
//       {
//         short: "Decisions",
//         icon: "person",
//         title: "Design decisions discussed along the way",
//         text: "You stay part of the conversation as the concept, layout and details take shape.",
//         image: IMG.details,
//         alt: "Warm modern bedroom interior with wood, stone and layered lighting",
//       },
//     ],
//   },
//   process: {
//     visible: true,
//     eyebrow: "OUR PROCESS",
//     heading: h("A simple, well-planned journey.", "h2"),
//     steps: [
//       { title: h("Initial consultation", "h3"), text: "We understand your preferences, requirements, space and vision." },
//       { title: h("Creative concept", "h3"), text: "We shape a design direction that reflects your style and needs." },
//       { title: h("Design strategy", "h3"), text: "Layouts, materials and design details are brought into a clear plan." },
//       { title: h("Execution planning", "h3"), text: "We prepare the details required to move the approved design forward." },
//       { title: h("Final handover", "h3"), text: "The completed space is reviewed and handed over with care." },
//     ],
//     footnote: "Specific scope, quotation, materials and timings are discussed for each project before work proceeds.",
//   },
//   stats: {
//     visible: true,
//     items: [
//       { value: "8", suffix: "+", label: "years of experience" },
//       { value: "2750", suffix: "+", label: "projects completed" },
//       { value: "450", suffix: "+", label: "people on our team" },
//       { value: "5", suffix: "", label: "branches across NCR" },
//     ],
//   },
//   ideas: {
//     visible: true,
//     eyebrow: "DESIGN IDEAS",
//     heading: h("Real life is the inspiration.", "h2"),
//     items: [
//       { title: h("Warm, natural living", "h3"), category: "Ready-to-go living", image: IMG.readyLiving },
//       { title: h("A kitchen made practical", "h3"), category: "Modular kitchen", image: IMG.readyKitchen },
//       { title: h("Quiet bedroom details", "h3"), category: "Master bedroom", image: IMG.readyBedroom },
//       { title: h("A slower outdoor escape", "h3"), category: "Balcony design", image: IMG.readyBalcony },
//     ],
//   },
//   experience: {
//     visible: true,
//     heading: h("Visit an experience center\nnear you", "h2"),
//     text: "Walk through finished rooms, feel the materials and talk to a designer in person.",
//     kicker: "Experience center",
//     centers: [
//       { city: h("Noida", "h3"), address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301", phone: "+91 70707 01373" },
//       {
//         city: h("Noida Extension", "h3"),
//         address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
//         phone: "+91 70707 01373",
//       },
//       {
//         city: h("Gurugram", "h3"),
//         address:
//           "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
//         phone: "+91 70707 01373",
//       },
//       {
//         city: h("Faridabad", "h3"),
//         address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Faridabad, Haryana 121002",
//         phone: "+91 70707 01373",
//       },
//     ],
//   },
//   locations: {
//     visible: true,
//     eyebrow: "SERVING DELHI NCR",
//     heading: h("Thoughtful interiors,\ncloser to home.", "h2"),
//     text: "Connect with HC Interior for design guidance across Delhi NCR. Choose your city to explore local services.",
//     areas: ["Noida", "Ghaziabad", "Greater Noida", "Noida Extension", "Delhi", "Dwarka", "Gurugram", "Manesar", "Sohna", "Faridabad"],
//   },
//   faq: {
//     visible: true,
//     eyebrow: "GOOD TO KNOW",
//     heading: h("Questions before\nyou begin?", "h2"),
//     text: "Here are a few useful details about designing with HC Interior.",
//     questionTag: "h3",
//     items: [
//       {
//         question: "What interior design services does HC Interior offer?",
//         answer:
//           "HC Interior offers interior design and planning, custom interior solutions, furniture and décor, and kitchen interior design. The right combination depends on your space and requirements.",
//       },
//       {
//         question: "Can the design be personalised to my home and style?",
//         answer:
//           "Yes. The design process starts by understanding your preferences, lifestyle and space requirements, then develops a concept and plan around them.",
//       },
//       {
//         question: "How does the interior design process work?",
//         answer:
//           "The published process covers an initial consultation, creative concept, design strategy, execution planning and final handover. Site visits, measurements, design presentation and quotation are discussed as the project develops.",
//       },
//       {
//         question: "Which areas does HC Interior serve?",
//         answer:
//           "HC Interior lists service areas across Delhi NCR, including Delhi, Noida, Noida Extension, Greater Noida, Ghaziabad, Gurugram, Faridabad, Dwarka, Manesar and Sohna. Contact the team to confirm support for your specific location.",
//       },
//     ],
//   },
//   finalCta: {
//     visible: true,
//     image: IMG.dining,
//     imageAlt: "Bright dining and living interior inspiration",
//     eyebrow: "THE FIRST STEP IS A CONVERSATION",
//     heading: h("Let’s plan a home\nthat works for you.", "h2"),
//     text: "Share your space, your ideas and what matters most. Start a discussion with HC Interior.",
//   },
// };



// Single source of truth for the /design-your-dream-space landing page.
// - The public page renders DEFAULT_CONTENT merged with whatever the CMS saved (GET /cms-landing-page/design-your-dream-space).
// - The CMS editor starts from the same merged object, so every field is pre-filled with the live text.
// Arrays saved from the CMS REPLACE the default arrays (that is what makes "delete" work).

export const PAGE_KEY = "design-your-dream-space";

export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
export const ICON_NAMES = ["person", "layers", "home", "palette", "pin", "phone", "phone-call", "chat", "check", "sparkle"];

export const safeHeadingTag = (tag, fallback = "h2") => (HEADING_TAGS.includes(tag) ? tag : fallback);
export const digitsOnly = (value) => String(value ?? "").replace(/\D/g, "");
// 10 digits -> add the India country code; anything longer is used as typed (digits only).
export const toDialNumber = (value) => {
  const digits = digitsOnly(value);
  return digits.length === 10 ? `91${digits}` : digits;
};

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export function mergeContent(base, saved) {
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
  if (isPlainObject(base)) {
    const source = isPlainObject(saved) ? saved : {};
    const out = {};
    Object.keys(base).forEach((key) => {
      out[key] = key in source ? mergeContent(base[key], source[key]) : base[key];
    });
    Object.keys(source).forEach((key) => {
      if (!(key in out)) out[key] = source[key];
    });
    return out;
  }
  return saved === undefined || saved === null ? base : saved;
}

const IMG = {
  hero: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618437357-424701680.png",
  planning: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
  custom: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618439213-81831281.png",
  furniture: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779626359913-930967107.png",
  kitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
  living: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624540042-958249945.jpg",
  details: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779874067164-110566752.png",
  dining: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779618591342-113150251.png",
  luxuryKitchen: "https://apidev.hcinterior.in/uploads/portfolio-projects/image-1779619195690-775248541.png",
  readyLiving: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624538388-973357356.jpg",
  readyKitchen: "https://apidev.hcinterior.in/uploads/parent-child/image-1742624476556-889005397.jpg",
  readyBedroom: "https://apidev.hcinterior.in/uploads/parent-child/image-1742645786915-419668135.jpg",
  readyBalcony: "https://apidev.hcinterior.in/uploads/parent-child/image-1737288595592-330954825.jpg",
};

const h = (text, tag) => ({ text, tag });

export const DEFAULT_CONTENT = {
  contact: {
    callNumber: "+91 70707 01373",
    whatsappNumber: "+91 70707 01373",
    whatsappGreeting: "Hello HC Interior, I would like to discuss an interior design enquiry.",
  },
  buttons: {
    getQuote: "Get Design Quote",
    getQuoteMobile: "Let’s Get Started",
    call: "Call",
    whatsapp: "Chat on WhatsApp",
    directions: "Get directions",
    scheduleVisit: "Schedule visit",
    bookConsultation: "Book a consultation",
  },
  header: {
    logo: "/images/new_hc_logo.png",
    logoAlt: "High Creation Interior",
  },
  form: {
    heading: h("Get a free design consultation", "h2"),
    submitText: "Schedule a Design Consultation",
    thankYouHeading: h("Thank you", "h2"),
    thankYouText: "Thank you for contacting High Creation Interior, our team will connect with you soon.",
  },
  hero: {
    heading: h(
      "Creating better homes: interior design with complete customization and in-house production across Delhi NCR",
      "h1"
    ),
    phrases: [
      "Complete customization for every corner of your home.",
      "In-house production, crafted with care.",
      "Free design consultation to plan your next step.",
      "A better home starts with a clear plan.",
    ],
    image: IMG.planning,
    areasText:
      "Our Interior Design services available in Delhi, Gurugram, Noida, Ghaziabad, Faridabad, Noida Extension, Manesar and Sohna.",
    points: ["Free design consultation", "Complete customization", "In-house production"],
  },
  benefits: {
    visible: true,
    items: [
      { icon: "person", title: h("Designed around you", "h2"), text: "Your lifestyle, preferences and space lead every design decision." },
      { icon: "palette", title: h("Material choices made clear", "h2"), text: "Explore finishes, textures and combinations with guidance." },
      { icon: "home", title: h("From concept to handover", "h2"), text: "A considered process from the first discussion to the final review." },
    ],
  },
  propertyStrip: {
    visible: true,
    eyebrow: "A HOME THAT FITS YOUR LIFE",
    heading: h("Find the right design\nfor your space.", "h2"),
    options: ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa"],
    hint: "Choose a home type to continue to the home estimator.",
  },
  services: {
    visible: true,
    eyebrow: "WHAT WE OFFER",
    heading: h("Good design is in the details.", "h2"),
    cardLabel: "SERVICE",
    items: [
      {
        title: h("Interior Design & Planning", "h3"),
        text: "Layouts, design concepts and material choices shaped around your space, preferences and everyday routine.",
        image: IMG.planning,
      },
      {
        title: h("Custom Interior Design", "h3"),
        text: "Personalised interiors and made-for-you solutions that bring style, comfort and functionality together.",
        image: IMG.custom,
      },
      {
        title: h("Furniture & Décor", "h3"),
        text: "Furniture, finishes and thoughtful details selected to complement the character of your home.",
        image: IMG.furniture,
      },
      {
        title: h("Kitchen Interior Design", "h3"),
        text: "Practical, well-planned kitchens designed around storage, workflow and the way you cook.",
        image: IMG.kitchen,
      },
    ],
  },
  rooms: {
    visible: true,
    eyebrow: "ROOM INSPIRATION",
    heading: h("Beautiful spaces, thoughtfully imagined.", "h2"),
    items: [
      { title: h("Kitchen", "h3"), label: "Premium modular kitchen", image: IMG.luxuryKitchen },
      { title: h("Living Room", "h3"), label: "Considered luxury living", image: IMG.hero },
      { title: h("Master Bedroom", "h3"), label: "A restful premium retreat", image: IMG.details },
      { title: h("Wardrobe & Storage", "h3"), label: "Bespoke wardrobe details", image: IMG.furniture },
    ],
  },
  story: {
    visible: true,
    eyebrow: "A MORE CONSIDERED HOME",
    heading: h("Every room should earn its place.", "h2"),
    text: "A beautiful interior does more than look good. It brings together movement, storage, materials and comfort so your home works well in everyday life.",
    tagLabel: "Idea to interior",
    points: [
      {
        short: "Layouts",
        icon: "layers",
        title: "Layouts informed by your space and routines",
        text: "Movement, storage and furniture placement are planned around how each room is actually used day to day.",
        image: IMG.living,
        alt: "Living room layout with comfortable seating, natural light and warm finishes",
      },
      {
        short: "Finishes",
        icon: "palette",
        title: "Finishes and furniture chosen with intention",
        text: "Materials, textures and furniture are selected together so the room feels cohesive rather than assembled.",
        image: IMG.furniture,
        alt: "Wardrobe and storage interior with warm wood finishes and layered lighting",
      },
      {
        short: "Decisions",
        icon: "person",
        title: "Design decisions discussed along the way",
        text: "You stay part of the conversation as the concept, layout and details take shape.",
        image: IMG.details,
        alt: "Warm modern bedroom interior with wood, stone and layered lighting",
      },
    ],
  },
  process: {
    visible: true,
    eyebrow: "OUR PROCESS",
    heading: h("A simple, well-planned journey.", "h2"),
    steps: [
      { title: h("Initial consultation", "h3"), text: "We understand your preferences, requirements, space and vision." },
      { title: h("Creative concept", "h3"), text: "We shape a design direction that reflects your style and needs." },
      { title: h("Design strategy", "h3"), text: "Layouts, materials and design details are brought into a clear plan." },
      { title: h("Execution planning", "h3"), text: "We prepare the details required to move the approved design forward." },
      { title: h("Final handover", "h3"), text: "The completed space is reviewed and handed over with care." },
    ],
    footnote: "Specific scope, quotation, materials and timings are discussed for each project before work proceeds.",
  },
  stats: {
    visible: true,
    items: [
      { value: "8", suffix: "+", label: "years of experience" },
      { value: "2750", suffix: "+", label: "projects completed" },
      { value: "450", suffix: "+", label: "people on our team" },
      { value: "5", suffix: "", label: "branches across NCR" },
    ],
  },
  ideas: {
    visible: true,
    eyebrow: "DESIGN IDEAS",
    heading: h("Real life is the inspiration.", "h2"),
    items: [
      { title: h("Warm, natural living", "h3"), category: "Ready-to-go living", image: IMG.readyLiving },
      { title: h("A kitchen made practical", "h3"), category: "Modular kitchen", image: IMG.readyKitchen },
      { title: h("Quiet bedroom details", "h3"), category: "Master bedroom", image: IMG.readyBedroom },
      { title: h("A slower outdoor escape", "h3"), category: "Balcony design", image: IMG.readyBalcony },
    ],
  },
  experience: {
    visible: true,
    heading: h("Visit an experience center\nnear you", "h2"),
    text: "Walk through finished rooms, feel the materials and talk to a designer in person.",
    kicker: "Experience center",
    centers: [
      { city: h("Noida", "h3"), address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301", phone: "+91 70707 01373", mapUrl: "" },
      {
        city: h("Noida Extension", "h3"),
        address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
        phone: "+91 70707 01373", mapUrl: "",
      },
      {
        city: h("Gurugram", "h3"),
        address:
          "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
        phone: "+91 70707 01373", mapUrl: "",
      },
      {
        city: h("Faridabad", "h3"),
        address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Faridabad, Haryana 121002",
        phone: "+91 70707 01373", mapUrl: "",
      },
    ],
  },
  locations: {
    visible: true,
    eyebrow: "SERVING DELHI NCR",
    heading: h("Thoughtful interiors,\ncloser to home.", "h2"),
    text: "Connect with HC Interior for design guidance across Delhi NCR. Choose your city to explore local services.",
    areas: ["Noida", "Ghaziabad", "Greater Noida", "Noida Extension", "Delhi", "Dwarka", "Gurugram", "Manesar", "Sohna", "Faridabad"],
  },
  faq: {
    visible: true,
    eyebrow: "GOOD TO KNOW",
    heading: h("Questions before\nyou begin?", "h2"),
    text: "Here are a few useful details about designing with HC Interior.",
    questionTag: "h3",
    items: [
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
    ],
  },
  finalCta: {
    visible: true,
    image: IMG.dining,
    imageAlt: "Bright dining and living interior inspiration",
    eyebrow: "THE FIRST STEP IS A CONVERSATION",
    heading: h("Let’s plan a home\nthat works for you.", "h2"),
    text: "Share your space, your ideas and what matters most. Start a discussion with HC Interior.",
  },
};