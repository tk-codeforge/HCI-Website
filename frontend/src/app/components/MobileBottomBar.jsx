'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Importing sleek outline icons from react-icons
import { MdOutlineHome, MdOutlinePhotoLibrary, MdOutlineCalculate } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";
import Toggle from './Toggle';

export default function MobileBottomBar({ initialMenu = null }) {
  const pathname = usePathname();

  // Your exact brand primary color
  const brandOrange = '#ff914d'; 

  const isActive = (path) => pathname === path;
  const isInclude = (path) => pathname.includes(path);

  // prefetch={false}: this bar is on every page, and prefetching all four routes as soon as
  // it appears downloaded four extra pages on every phone visit.
  return (
    <div 
      className="fixed-bottom bg-white d-lg-none d-flex justify-content-between align-items-end pb-2 pt-2 shadow-lg" 
      style={{ 
        zIndex: 1050, 
        borderTop: '1px solid #e0e0e0',
        fontSize: '10px' 
      }}
    >
      {/* 1. Home */}
      <Link 
        href="/" 
        prefetch={false}
        className="text-decoration-none d-flex flex-column align-items-center flex-grow-1"
        style={{ color: isActive('/') ? brandOrange : '#6c757d' }}
      >
        <MdOutlineHome size={24} className="mb-1" />
        <span className="fw-bold">HOME</span>
      </Link>

      {/* 2. Design Ideas */}
      <Link 
        href="/design-idea" 
        prefetch={false}
        className="text-decoration-none d-flex flex-column align-items-center flex-grow-1"
        style={{ color: isInclude('/design-idea') ? brandOrange : '#6c757d' }}
      >
        <MdOutlinePhotoLibrary size={24} className="mb-1" />
        <span className="fw-bold text-center">DESIGN IDEAS</span>
      </Link>

      {/* 3. Center Floating Button (Let's Begin) */}
      <div className="d-flex flex-column align-items-center position-relative flex-grow-1">
        <Link 
          href="/contact" 
          prefetch={false}
          aria-label="Let's begin"
          className="rounded-circle d-flex justify-content-center align-items-center shadow-lg"
          style={{ 
            width: '56px', 
            height: '56px', 
            backgroundColor: brandOrange, 
            color: 'white',
            position: 'absolute', 
            top: '-45px', 
            border: '4px solid white' 
          }}
        >
          <HiSparkles size={28} />
        </Link>
        <span className="fw-bold mt-4 pt-1 text-center" style={{ color: '#6c757d' }}>{`LET'S BEGIN`}</span>
      </div>

      {/* 4. Get Estimate */}
      <Link 
        href="/estimator-for-home" 
        prefetch={false}
        className="text-decoration-none d-flex flex-column align-items-center flex-grow-1"
        style={{ color: isInclude('/estimator-for-home') ? brandOrange : '#6c757d' }}
      >
        <MdOutlineCalculate size={24} className="mb-1" />
        <span className="fw-bold text-center">ESTIMATE</span>
      </Link>

      {/* 5. More (Hamburger) */}
      {/* A div, not a button: Toggle renders its own <button>, and a button inside a button
          is invalid HTML. That is why this bar could only be rendered after mount. */}
      <div
        className="btn btn-link text-decoration-none d-flex flex-column align-items-center flex-grow-1 p-0 border-0"
        style={{ color: '#6c757d' }}
      >
        <Toggle initialMenu={initialMenu} />
      </div>
    </div>
  );
}
