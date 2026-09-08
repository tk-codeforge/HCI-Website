"use client"; 
import { useState, useEffect, useRef } from "react";
import { IoIosCall } from "react-icons/io";
import Image from "next/image";
import api from "@/utils/api";

const DEFAULT_SERVING_AREAS = [
  { label: "Interior Designers In Noida", href: "/interior-designers-in-noida" },
  { label: "Interior Designers in Ghaziabad", href: "/interior-designers-in-ghaziabad" },
  { label: "Interior Designers in Greater Noida", href: "/interior-designers-in-greater-noida" },
  { label: "Interior Designers in Delhi", href: "/interior-designers-in-delhi" },
  { label: "Interior Designers in Dwarka", href: "/interior-designers-in-dwarka" },
  { label: "Interior Designers in Faridabad", href: "/interior-designers-in-faridabad" },
  { label: "Interior Designers in Gurugram", href: "/interior-designers-in-gurgaon" },
  { label: "Interior Designers In Manesar", href: "/interior-designers-in-manesar" },
  { label: "Interior Designers in Sohna", href: "/interior-designer-in-sohna-gurgaon" },
  { label: "Interior Designer in Noida Extension", href: "/interior-designer-in-noida-extension" }
];

const Header = () => {
  
  useEffect(() => {
    const fetchServingAreas = async () => {
      try {
        const res = await api.get("/cms-content/navbar_serving_area");
        if (res.data) {
          const record = Array.isArray(res.data) ? res.data[0] : res.data;
          const items = record?.json_content?.items;
          if (items && items.length > 0) {
            setServingAreas(items);
          }
        }
      } catch (err) {
        console.error("Failed to load CMS serving area navigation:", err);
      }
    };

    fetchServingAreas();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [servingAreas, setServingAreas] = useState(DEFAULT_SERVING_AREAS);
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
                
                <li className={`nav-item dropdown ${activeDropdown === 'design' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'design')} aria-expanded={activeDropdown === 'design'}>
                    Design Ideas
                  </a>
                  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'design' ? 'show' : ''}`}>
                    <li><a className="dropdown-item py-2" href="/design-idea/">Design Gallery</a></li>
                    <li><a className="dropdown-item py-2" href="/product/">Product</a></li>
                  </ul>
                </li>

                <li className={`nav-item dropdown ${activeDropdown === 'portfolio' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'portfolio')} aria-expanded={activeDropdown === 'portfolio'}>
                    Portfolio
                  </a>
                  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'portfolio' ? 'show' : ''}`}>
                    <li><a className="dropdown-item py-2" href="/residential-projects/">Residential Projects</a></li>
                    <li><a className="dropdown-item py-2" href="/luxury-projects/">Luxury Projects</a></li>
                  </ul>
                </li>

                <li className={`nav-item dropdown ${activeDropdown === 'experience' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'experience')} aria-expanded={activeDropdown === 'experience'}>
                   Experience Center
                  </a>
                  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'experience' ? 'show' : ''}`}>
                    <li><a className="dropdown-item py-2" href="/experience-center/">Experience Center Noida</a></li>
                    <li><a className="dropdown-item py-2" href="/experience-center-gurugram/">Experience Center Gurugram</a></li>
                  
                    <li><a className="dropdown-item py-2" href="/experience-center-faridabad/">Experience Center Faridabad</a></li>
                    <li><a className="dropdown-item py-2" href="/experience-center-noida-extension/">Experience Center Noida Extension</a></li>
                  </ul>
                </li>

                <li className={`nav-item dropdown ${activeDropdown === 'exclusive' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'exclusive')} aria-expanded={activeDropdown === 'exclusive'}>
                    Exclusive Design
                  </a>
                  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'exclusive' ? 'show' : ''}`}>
                    <li><a className="dropdown-item py-2" href="/ready-togo-design/">Ready To Go Design</a></li>
                    <li><a className="dropdown-item py-2" href="/wallpaper/">Wallpapers</a></li>
                    <li><a className="dropdown-item py-2" href="/spacesaving-furniture/">Space-Saving Furniture</a></li>
                    <li><a className="dropdown-item py-2" href="/sustainable-furniture/">Sustainable Furniture</a></li>
                    <li><a className="dropdown-item py-2" href="/furniture/">Furniture</a></li>
                  </ul>
                </li>

                {/* <li className={`nav-item dropdown ${activeDropdown === 'services' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'services')} aria-expanded={activeDropdown === 'services'}>
                    Serving Area
                  </a>
                  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'services' ? 'show' : ''}`}>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-noida">Interior Designers In Noida</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-ghaziabad">Interior Designers in Ghaziabad</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-greater-noida">Interior Designers in Greater Noida</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-delhi">Interior Designers in Delhi</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-dwarka">Interior Designers in Dwarka</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-faridabad">Interior Designers in Faridabad</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-gurgaon">Interior Designers in Gurugram</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designers-in-manesar">Interior Designers In Manesar</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designer-in-sohna-gurgaon">Interior Designers in Sohna</a></li>
                    <li><a className="dropdown-item py-2" href="/interior-designer-in-noida-extension">Interior Designer in Noida Extension</a></li>

                  </ul>
                </li> */}

                <li className={`nav-item dropdown ${activeDropdown === 'services' ? 'show' : ''}`}>
  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'services')} aria-expanded={activeDropdown === 'services'}>
    Serving Areas
  </a>
  <ul className={`dropdown-menu border-0 shadow-sm ${activeDropdown === 'services' ? 'show' : ''}`}>
    {servingAreas.map((item, index) => (
      <li key={index}>
        <a className="dropdown-item py-2" href={item.href}>
          {item.label}
        </a>
      </li>
    ))}
  </ul>
</li>

                <li className={`nav-item dropdown ${activeDropdown === 'more' ? 'show' : ''}`}>
                  <a className="nav-link dropdown-toggle text-dark" href="#" onClick={(e) => handleDropdown(e, 'more')} aria-expanded={activeDropdown === 'more'}>
                    More
                  </a>
                  <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 ${activeDropdown === 'more' ? 'show' : ''}`} style={{ minWidth: '180px' }}>
                    <li><a className="dropdown-item py-2" href="/about-us/">About Us</a></li>
                    <li><a className="dropdown-item py-2" href="/how-its-works/">How It Works</a></li>
                    <li><a className="dropdown-item py-2" href="/services/">Serving Areas</a></li>
                    <li><a className="dropdown-item py-2" href="/team/">Team</a></li>
                    <li><a className="dropdown-item py-2" href="/contact/">Contact Us</a></li>
                    <li><a className="dropdown-item py-2" href="/blog/">Blogs</a></li>
                    <li><a className="dropdown-item py-2" href="/awards/">Awards Gallery</a></li>
                  </ul>
                </li>
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