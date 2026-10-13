"use client";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaBars } from "react-icons/fa";
import api from "@/utils/api";

// const DEFAULT_SERVING_AREAS = [
//   { label: "Interior Designers In Noida", href: "/interior-designers-in-noida" },
//   { label: "Interior Designers in Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Interior Designers in Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Interior Designers in Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Interior Designers in Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Interior Designers in Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Interior Designers in Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Interior Designers In Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Interior Designers in Sohna", href: "/interior-designer-in-sohna-gurgaon" },
//   { label: "Interior Designer in Noida Extension", href: "/interior-designer-in-noida-extension" }
// ];

const DEFAULT_MENU = [
  { label: "Design Ideas", href: "", dropdown: [
    { label: "Design Gallery", href: "/design-idea/" },
    { label: "Product", href: "/product/" },
  ]},
  { label: "Portfolio", href: "", dropdown: [
    { label: "Residential Projects", href: "/residential-projects/" },
    { label: "Luxury Projects", href: "/luxury-projects/" },
  ]},
  { label: "Experience Center", href: "", dropdown: [
    { label: "Experience Center New Delhi", href: "/experience-center-new-delhi/" },
    { label: "Experience Center Noida", href: "/experience-center/" },
    { label: "Experience Center Noida Extension", href: "/experience-center-noida-extension/" },
    { label: "Experience Center Gurgaon", href: "/experience-center-gurugram/" },
    { label: "Experience Center Faridabad", href: "/experience-center-faridabad/" },
  ]},
  { label: "Exclusive Design", href: "", dropdown: [
    { label: "Ready To Go Design", href: "/ready-togo-design/" },
    { label: "Wallpapers", href: "/wallpaper/" },
    { label: "Space-Saving Furniture", href: "/spacesaving-furniture/" },
    { label: "Sustainable Furniture", href: "/sustainable-furniture/" },
    { label: "Furniture", href: "/furniture/" },
  ]},
  { label: "Serving Areas", href: "", dropdown: [
    { label: "Interior Designers In Noida", href: "/interior-designers-in-noida" },
    { label: "Interior Designers in Ghaziabad", href: "/interior-designers-in-ghaziabad" },
    { label: "Interior Designers in Greater Noida", href: "/interior-designers-in-greater-noida" },
    { label: "Interior Designers in Delhi", href: "/interior-designers-in-delhi" },
    { label: "Interior Designers in Dwarka", href: "/interior-designers-in-dwarka" },
    { label: "Interior Designers in Faridabad", href: "/interior-designers-in-faridabad" },
    { label: "Interior Designers in Gurugram", href: "/interior-designers-in-gurgaon" },
    { label: "Interior Designers In Manesar", href: "/interior-designers-in-manesar" },
    { label: "Interior Designers in Sohna", href: "/interior-designer-in-sohna-gurgaon" },
    { label: "Interior Designer in Noida Extension", href: "/interior-designer-in-noida-extension" },
  ]},
  { label: "More", href: "", dropdown: [
    { label: "About Us", href: "/about-us/" },
    { label: "How It Works", href: "/how-its-works/" },
    { label: "Serving Areas", href: "/services/" },
    { label: "Team", href: "/team/" },
    { label: "Contact Us", href: "/contact/" },
    { label: "Blogs", href: "/blog/" },
    { label: "Awards Gallery", href: "/awards/" },
  ]},
];

const Toggle = () => {
  const [lookMenu, setLookMenu] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [servingAreaItems, setServingAreaItems] = useState(DEFAULT_SERVING_AREAS);
const [menu, setMenu] = useState(DEFAULT_MENU);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    setLoading(true);
    const fetchLookMenu = async () => {
      try {
        const response = await api.get("/look-menu");
        setLookMenu(response.data); 
      } catch (err) {
        console.error("Error fetching design idea:", err);
        setError("Failed to load design ideas. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLookMenu();
  }, []);

//   useEffect(() => {
//   const fetchServingArea = async () => {
//     try {
//       const res = await api.get("/cms-content/navbar_serving_area");
//       if (res.data) {
//         const record = Array.isArray(res.data) ? res.data[0] : res.data;
//         const content = record?.json_content || {};
//         if (content.items && content.items.length > 0) {
//           setServingAreaItems(content.items);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching serving area menu:", err);
//       // keep DEFAULT_SERVING_AREAS as fallback
//     }
//   };

//   fetchServingArea();
// }, []);

useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await api.get("/cms-content/navbar_header_menu");
      if (res.data) {
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        const items = record?.json_content?.menu;
        if (items && items.length > 0) {
          setMenu(items);
        }
      }
    } catch (err) {
      console.error("Error fetching header menu:", err);
      // keep DEFAULT_MENU as fallback
    }
  };

  fetchMenu();
}, []);

const getColumn = (label) => {
  const found = menu.find((h) => h.label === label);
  if (found && Array.isArray(found.dropdown) && found.dropdown.length > 0) {
    return found.dropdown;
  }
  const fallback = DEFAULT_MENU.find((h) => h.label === label);
  return fallback ? fallback.dropdown : [];
};

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .menu-toggle-btn {
          transition: all 0.3s ease;
          color: #333;
        }
        .menu-toggle-btn:hover {
          transform: scale(1.15);
          color: #ff914d;
        }
        
        #mySidebar {
          background-color: rgba(15, 15, 15, 0.98);
          backdrop-filter: blur(12px);
          font-family: 'Poppins', sans-serif; /* Clean, readable font for the whole menu */
        }

        .sidebar-close-btn {
          transition: transform 0.4s ease, color 0.3s ease;
          color: #ffffff;
        }
        .sidebar-close-btn:hover {
          transform: rotate(90deg) scale(1.2);
          color: #ff914d;
        }
        
        /* Keep the cursive ONLY for the main brand heading */
        .offcanvas_heading {
          font-family: 'Dancing Script', cursive; 
          background: -webkit-linear-gradient(45deg, #fff, #ff914d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 3.5rem; 
          line-height: 1.2;
        }
        
        .offcanvas_description {
          color: #a3a3a3; 
          line-height: 1.8;
          font-size: 1.05rem; 
        }

        .stylish-section-title {
          color: #ff914d;
          font-weight: 600;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1.5rem;
        }

        .offcanvas_anchor {
          transition: color 0.3s ease, transform 0.3s ease;
          color: #d1d1d1;
          text-decoration: none;
          display: inline-block;
          font-size: 1rem;
          font-weight: 400;
          padding: 6px 0; /* Better tap target for mobile */
        }
        .offcanvas_anchor:hover {
          color: #ff914d;
          transform: translateX(8px); 
        }

        /* 🌟 MOBILE RESPONSIVENESS FIXES 🌟 */
        @media (max-width: 991px) {
          .offcanvas_heading {
            font-size: 2.8rem;
            text-align: center;
            margin-bottom: 1rem !important;
          }
          .offcanvas_description {
            text-align: center;
            margin-bottom: 2.5rem;
          }
          
          /* Switch from horizontal columns to a clean vertical stack */
          .mobile-menu-grid {
            display: flex;
            flex-direction: column;
            gap: 2.5rem; /* Space out the categories */
          }
          
          .mobile-menu-column {
            width: 100%;
            text-align: center; /* Center everything for a clean mobile look */
            border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* Subtle dividers */
            padding-bottom: 2rem;
          }
          
          .mobile-menu-column:last-child {
            border-bottom: none;
          }
          
          .stylish-section-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: #ffffff; /* White looks cleaner centered on mobile */
          }
          
          .offcanvas_anchor {
            font-size: 1.1rem;
            padding: 10px 0; /* Much bigger tap target for thumbs */
            width: 100%;
          }
        }
      `}} />

      {/* Button to open sidebar */}
      <button 
        className="btn border-0 p-0 d-flex flex-column align-items-center justify-content-center" 
        onClick={openSidebar} 
        aria-label="Open sidebar menu"
      >
        <FaBars className="fs-2 menu-toggle-btn" />
        <span style={{ fontSize: "0.7rem" }}>Menu</span>
      </button>

      {/* Sidebar */}
      <div
        id="mySidebar"
        style={{
          width: isOpen ? "100%" : "0", 
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          overflowX: "hidden",
          overflowY: "auto", 
          height: "100%",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", 
          zIndex: 1055, 
        }}
      >
        <div className="d-flex justify-content-end align-items-center container-fluid px-4 px-lg-5 pt-4">
          <div className="close">
            <button
              type="button"
              onClick={closeSidebar}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-label="Close sidebar"
            >
              <IoCloseCircleOutline className="fs-1 sidebar-close-btn" />
            </button>
          </div>
        </div>

        <div style={{ padding: "10px 10px 60px", color: "white" }}>
          <div className="container-fluid px-lg-5">
            <div className="row mt-3">
              
              {/* Left Column Intro (Visible on Desktop, stacked on Mobile) */}
              <div className="col-lg-4 pe-lg-5">
                <h2 className="offcanvas_heading fw-bold">
                  High Creation Interior
                </h2>
                <p className="offcanvas_description">
                  If you are looking out for a beautiful home that fits in your
                  budget, Yes! You are at the right place, we will make your
                  dream home come true.
                </p>
              </div>

              {/* Right Column Links */}
              <div className="col-lg-8">
                <div className="row mobile-menu-grid">
                  
                  {/* 1st - Projects */}
                  {/* <div className="col-lg-3 mobile-menu-column">
                    <h5 className="stylish-section-title">Projects</h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
                      <li><a href="/residential-projects" className="offcanvas_anchor" onClick={closeSidebar}>Residential Projects</a></li>
                      <li><a href="/luxury-projects" className="offcanvas_anchor" onClick={closeSidebar}>Luxury Projects</a></li>
                    </ul>
                  </div> */}

                  {/* 2nd - Experience Center */}
                  {/* <div className="col-lg-3 mobile-menu-column">
                    <h5 className="stylish-section-title">Experience Center</h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
                      <li><a href="/experience-center-new-delhi/" className="offcanvas_anchor" onClick={closeSidebar}>New Delhi Experience Center</a></li>
                      <li><a href="/experience-center/" className="offcanvas_anchor" onClick={closeSidebar}>Noida Experience Center</a></li>
                      <li><a href="/experience-center-noida-extension/" className="offcanvas_anchor" onClick={closeSidebar}>Noida Extension Experience Center</a></li>
                      <li><a href="/experience-center-gurugram/" className="offcanvas_anchor" onClick={closeSidebar}>Gurgaon Experience Center</a></li>
                      <li><a href="/experience-center-faridabad/" className="offcanvas_anchor" onClick={closeSidebar}>Faridabad Experience Center</a></li>
                    </ul>
                  </div> */}

                  {/* 3rd - Cities */}
                  {/* <div className="col-lg-3 mobile-menu-column">
                    <h5 className="stylish-section-title">Cities</h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
                      <li><a href="/interior-designers-in-noida" className="offcanvas_anchor" onClick={closeSidebar}>Designers In Noida</a></li>
                      <li><a href="/interior-designers-in-ghaziabad" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Ghaziabad</a></li>
                      <li><a href="/interior-designers-in-greater-noida" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Greater Noida</a></li>
                      <li><a href="/interior-designers-in-delhi" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Delhi</a></li>
                      <li><a href="/interior-designers-in-dwarka" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Dwarka</a></li>
                      <li><a href="/best-interior-designers-in-faridabad" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Faridabad</a></li>
                      <li><a href="/interior-designers-in-gurgaon" className="offcanvas_anchor" onClick={closeSidebar}>Designers in Gurugram</a></li>
                      <li><a href="/interior-designers-in-manesar" className="offcanvas_anchor" onClick={closeSidebar}>Designers In Manesar</a></li>
                      <li><a href="/interior-designer-in-sohna-gurgaon" className="offcanvas_anchor" onClick={closeSidebar}>Designers In Sohna</a></li>
                    </ul>
                  </div> */}
                  {/* 3rd - Cities */}
{/* <div className="col-lg-3 mobile-menu-column">
  <h5 className="stylish-section-title">Cities</h5>
  <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
    {servingAreaItems.map((item, idx) => (
      <li key={idx}>
        <a href={item.href} className="offcanvas_anchor" onClick={closeSidebar}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div> */}

                  {/* 4th - Design Ideas */}
                  {/* <div className="col-lg-3 mobile-menu-column">
                    <h5 className="stylish-section-title">Design Ideas</h5>
                    <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
                      <li><a href="/furniture/" className="offcanvas_anchor" onClick={closeSidebar}>Furniture</a></li>
                      <li><a href="/ready-togo-design/" className="offcanvas_anchor" onClick={closeSidebar}>Ready To Go</a></li>
                      <li><a href="/sustainable-furniture/" className="offcanvas_anchor" onClick={closeSidebar}>Sustainable</a></li>
                      <li><a href="/spacesaving-furniture/" className="offcanvas_anchor" onClick={closeSidebar}>Space-Saving</a></li>
                      <li><a href="/wallpaper/" className="offcanvas_anchor" onClick={closeSidebar}>Wallpapers</a></li>
                    </ul>
                  </div> */}

                  {/* 1st - Projects (maps to "Portfolio" heading) */}
<div className="col-lg-3 mobile-menu-column">
  <h5 className="stylish-section-title">Projects</h5>
  <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
    {getColumn("Portfolio").map((item, idx) => (
      <li key={idx}>
        <a href={item.href} className="offcanvas_anchor" onClick={closeSidebar}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>

{/* 2nd - Experience Center */}
<div className="col-lg-3 mobile-menu-column">
  <h5 className="stylish-section-title">Experience Center</h5>
  <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
    {getColumn("Experience Center").map((item, idx) => (
      <li key={idx}>
        <a href={item.href} className="offcanvas_anchor" onClick={closeSidebar}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>

{/* 3rd - Cities (maps to "Serving Areas" heading) */}
<div className="col-lg-3 mobile-menu-column">
  <h5 className="stylish-section-title">Cities</h5>
  <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
    {getColumn("Serving Areas").map((item, idx) => (
      <li key={idx}>
        <a href={item.href} className="offcanvas_anchor" onClick={closeSidebar}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>

{/* 4th - Design Ideas (maps to "Exclusive Design" heading — matches your current hardcoded items) */}
<div className="col-lg-3 mobile-menu-column">
  <h5 className="stylish-section-title">Design Ideas</h5>
  <ul className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-lg-start">
    {getColumn("Exclusive Design").map((item, idx) => (
      <li key={idx}>
        <a href={item.href} className="offcanvas_anchor" onClick={closeSidebar}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toggle;