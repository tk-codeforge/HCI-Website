import dynamic from "next/dynamic";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Footer from "./footer";
import Header from "./Header";
import MobileBottomBar from "../components/MobileBottomBar";

const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), { 
  ssr: false, 
});

const MainLayout = ({ children }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .global-floating-widget {
          position: fixed;
          right: 20px; /* Slightly more inset for standard look */
          bottom: 90px; /* Shifted up to avoid overlapping with bottom bars */
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        /* 🌟 FIX: Increased base size for Desktop (54px) */
        .widget-btn {
          width: 54px; height: 54px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease; text-decoration: none;
        }
        
        .widget-btn:hover { 
          transform: translateY(-5px); /* Pops up slightly on hover */
          color: white; 
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }
        
        .widget-btn.call { background: var(--hc-primary, #ff914d); }
        .widget-btn.whatsapp { background: #25D366; }
        
        /* 🌟 FIX: Standard Mobile Sizing (48px) */
        @media (max-width: 768px) {
          .global-floating-widget {
            right: 15px;
            bottom: 85px; 
            gap: 12px;
          }
          .widget-btn {
            width: 48px; height: 48px; 
          }
          /* Auto-scales the React Icons down slightly for mobile */
          .widget-btn svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
      `}} />

      <Header />
      
      <main>{children}</main>

      {/* Global Floating Icons - Restored Original WA Number */}
      <div className="global-floating-widget">
        <a href="tel:+917070701373" className="widget-btn call" aria-label="Call Us">
          {/* 🌟 FIX: Increased Icon Sizes */}
          <FaPhoneAlt size={24} />
        </a>
        <a href="https://wa.me/919560277787" target="_blank" rel="noopener noreferrer" className="widget-btn whatsapp" aria-label="WhatsApp Us">
          <FaWhatsapp size={28} />
        </a>
      </div>

      <ContactUsPopUp />
      <MobileBottomBar />
      <Footer />
    </>
  );
};

export default MainLayout;