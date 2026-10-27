"use client"; 
import { useState, useEffect, useRef } from "react";
import { IoIosCall } from "react-icons/io";
import Image from "next/image";
import api from "@/utils/api";


const DEFAULT_MENU = [
  {
    label: "Design Ideas",
    dropdown: [
      { label: "Design Gallery", href: "/design-idea/" },
      { label: "Product", href: "/product/" },
    ],
  },
  {
    label: "Portfolio",
    dropdown: [
      { label: "Residential Projects", href: "/residential-projects/" },
      { label: "Luxury Projects", href: "/luxury-projects/" },
    ],
  },
  {
    label: "Experience Center",
    dropdown: [
      { label: "Experience Center New Delhi", href: "/experience-center-new-delhi/" },
      { label: "Experience Center Noida", href: "/experience-center/" },
      { label: "Experience Center Noida Extension", href: "/experience-center-noida-extension/" },
      { label: "Experience Center Gurgaon", href: "/experience-center-gurugram/" },
      { label: "Experience Center Faridabad", href: "/experience-center-faridabad/" },
    ],
  },
  {
    label: "Exclusive Design",
    dropdown: [
      { label: "Ready To Go Design", href: "/ready-togo-design/" },
      { label: "Wallpapers", href: "/wallpaper/" },
      { label: "Space-Saving Furniture", href: "/spacesaving-furniture/" },
      { label: "Sustainable Furniture", href: "/sustainable-furniture/" },
      { label: "Furniture", href: "/furniture/" },
    ],
  },
  {
    label: "Serving Areas",
    dropdown: [
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
    ],
  },
  {
    label: "More",
    dropdown: [
      { label: "About Us", href: "/about-us/" },
      { label: "How It Works", href: "/how-its-works/" },
      { label: "Serving Areas", href: "/services/" },
      { label: "Team", href: "/team/" },
      { label: "Contact Us", href: "/contact/" },
      { label: "Blogs", href: "/blog/" },
      { label: "Awards Gallery", href: "/awards/" },
    ],
  },
];


  const Header = ({ initialMenu = null }) => {
  const [menu, setMenu] = useState(initialMenu || DEFAULT_MENU);

  useEffect(() => {
  if (initialMenu) return; // already server-rendered from CMS
  const fetchMenu = async () => {
    try {
      const res = await api.get("/cms-content/navbar_header_menu");
      const record = Array.isArray(res.data) ? res.data[0] : res.data;
      const items = record?.json_content?.menu;
      if (items && items.length > 0) setMenu(items);
    } catch (err) {
      console.error("Failed to load CMS header menu:", err);
    }
  };
  fetchMenu();
}, [initialMenu]);


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleDropdown = (e, menuName) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  useEffect(() => {
    window.addEventListener('toggleMobileMenu', toggleMenu);
    return () => window.removeEventListener('toggleMobileMenu', toggleMenu);
  }, []);

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", closeDropdowns);
    return () => document.removeEventListener("mousedown", closeDropdowns);
  }, []);

  return (
    <>
      <div className="fixed-top bg-white shadow-sm py-1" ref={navRef}>
        <div className="container-fluid px-4">
          
          <nav className="navbar navbar-expand-lg p-0">
            
            {/* 1. LEFT: Logo (Sleeker look) */}
            <a className="navbar-brand" href="/" aria-label="Home">
              <Image
                src="/images/new_hc_logo.png"
                width={70} 
                height={70}
                alt="High Creation Interior Logo"
                priority
                style={{ width: '70px', height: '70px', objectFit: 'contain' }}
              />
            </a>
            
            {/* Mobile Toggle Button */}
            <button 
              className="navbar-toggler border-0 shadow-none" 
              type="button" 
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* 2. CENTER: Navigation Links */}
            <div className={`collapse navbar-collapse justify-content-center ${isMenuOpen ? "show" : ""}`}>
              <ul className="navbar-nav mb-2 mb-lg-0 gap-lg-3 fw-medium">
                
{menu.map((heading, index) => {
  const key = heading.label?.toLowerCase().replace(/\s+/g, "-") || `menu-${index}`;
  const hasDropdown = Array.isArray(heading.dropdown) && heading.dropdown.length > 0;

  return (
    <li className={`nav-item dropdown ${activeDropdown === key ? "show" : ""}`} key={key}>
  
    <button
  type="button"
  className="nav-link dropdown-toggle text-dark"
  onClick={(e) => handleDropdown(e, key)}
  aria-expanded={activeDropdown === key}
>
  {heading.label}
</button>
      <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === key ? "show" : ""}`}>
        {heading.dropdown.map((item, i) => (
          <li key={i}>
            <a className="dropdown-item py-2" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
})}
                
              </ul>
            </div>

            {/* 3. RIGHT: Call to Action (Reverted back to your original styling) */}
            <div className="d-none d-lg-flex ms-auto align-items-center">
              <a href="/estimator-for-home" className="get_btn text-nowrap">
                Get Estimate <IoIosCall className="callicon" />
              </a>
            </div>

          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;