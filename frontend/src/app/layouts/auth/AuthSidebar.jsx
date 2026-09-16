"use client";
import React, { useState, useEffect } from 'react';
import { MdOutlineDashboard, MdMessage, MdLeaderboard, MdOutlineSettings, MdWeb } from "react-icons/md";
import { FaCalculator, FaFileAlt, FaRegUser, FaChevronDown, FaChevronUp, FaImages, FaBuilding, FaInfoCircle, FaFileContract, FaStore } from "react-icons/fa";
import { IoHomeOutline, IoLayersOutline } from "react-icons/io5";
import { IoMdContacts, IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '../../../store/slices/authSlice';
import Link from 'next/link';
import { getCmsAccess } from '@/utils/cmsAccess';

function AuthSidebar() {
    const { user } = useSelector((state) => state.auth);
    const { isAdmin } = getCmsAccess(user);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const [openGroups, setOpenGroups] = useState({});

    // Auto-open groups based on current URL path
    useEffect(() => {
        if (pathname.includes('seo') || pathname.includes('robots') || pathname.includes('site-setting') || pathname.includes('redirects') || pathname.includes('/cms/pages') || pathname.includes('footer') || pathname.includes('media') || pathname.includes('look_menu') || pathname.includes('city')) setOpenGroups(prev => ({ ...prev, coreSetup: true }));
        if (pathname.includes('/cms/home-page') || pathname.includes('homepage-banner') || pathname.includes('why-choose-us') || pathname.includes('creating-the-home')) setOpenGroups(prev => ({ ...prev, homepage: true }));
        if (pathname.includes('gallery') || pathname.includes('portfolio') || pathname.includes('reallife')) setOpenGroups(prev => ({ ...prev, galleries: true }));
        if (pathname.includes('experience-center')) setOpenGroups(prev => ({ ...prev, expCenters: true }));
        if (pathname.includes('exclusive-design') || pathname.includes('product') || pathname.includes('designer-choice')) setOpenGroups(prev => ({ ...prev, products: true }));
        if (pathname.includes('about') || pathname.includes('team') || pathname.includes('blog') || pathname.includes('faq') || pathname.includes('how-its-works') || pathname.includes('refer')) setOpenGroups(prev => ({ ...prev, company: true }));
        if (pathname.includes('policy') || pathname.includes('term-and-condition')) setOpenGroups(prev => ({ ...prev, policies: true }));
    }, [pathname]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const toggleGroup = (groupName) => {
        setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const isActive = (path) => pathname === path ? 'active-link' : '';

    return (
        <div className="modern-sidebar-wrapper">
            <style dangerouslySetInnerHTML={{__html: `
                /* 🌟 LIGHT, CLEAN, MODERN THEME */
                .modern-sidebar-wrapper {
                    height: 100vh;
                    overflow-y: auto;
                    background-color: #ffffff;
                    border-right: 1px solid #e2e8f0;
                    color: #334155;
                    font-family: 'Inter', system-ui, sans-serif;
                }
                
                /* Sleek Scrollbar */
                .modern-sidebar-wrapper::-webkit-scrollbar { width: 5px; }
                .modern-sidebar-wrapper::-webkit-scrollbar-track { background: #f8fafc; }
                .modern-sidebar-wrapper::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .modern-sidebar-wrapper::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                /* Parent Links */
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 10px 16px;
                    color: #475569 !important;
                    text-decoration: none;
                    transition: all 0.2s ease-in-out;
                    border-radius: 8px;
                    margin: 4px 16px;
                    font-size: 14px;
                    font-weight: 500;
                }
                .sidebar-link:hover {
                    background-color: #f1f5f9;
                    color: #ff914d;
                }
                .sidebar-link.active-link {
                    background-color: #ff914d !important;
                    color: #ffffff !important;
                    font-weight: 600;
                    box-shadow: 0 4px 10px rgba(255, 145, 77, 0.25);
                }
                
                /* Accordion Headers */
                .sidebar-group-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    color: #64748b !important;
                    cursor: pointer;
                    margin: 4px 16px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: background 0.2s;
                }
                .sidebar-group-title:hover { 
                    background-color: #f8fafc; 
                    color: #334155; 
                }
                
                /* Sub-menu styling (NO YELLOW LINES!) */
                .sub-menu {
                    margin: 0 16px 8px 16px;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .sub-menu-link {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px 8px 40px;
                    color: #64748b !important;
                    text-decoration: none;
                    font-size: 13.5px;
                    transition: all 0.2s;
                    border-radius: 6px;
                    margin: 2px 0;
                }
                .sub-menu-link:hover { 
                    color: #ff914d; 
                    background-color: #f8fafc; 
                }
                .sub-menu-link.active-link {
                    color: #ff914d;
                    font-weight: 600;
                    background-color: #fff4ed; /* Soft orange tint */
                }

                /* Mobile Responsiveness */
                @media (max-width: 991px) {
                    .modern-sidebar-wrapper {
                        max-width: 280px;
                        box-shadow: 4px 0 15px rgba(0,0,0,0.05);
                    }
                }
            `}} />

            <div className="pt-4 pb-5">
                {/* USER PROFILE CARD */}
                <div className="text-center mb-4 pb-4 border-bottom" style={{ borderColor: '#e2e8f0 !important' }}>
                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                        <FaRegUser size={24} color="#94a3b8" />
                    </div>
                    <h6 className="text-dark mb-1 fw-bold">{user?.firstName} {user?.lastName}</h6>
                    <p className="mb-0" style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
                    {isAdmin && <span className="badge mt-2" style={{ backgroundColor: '#ff914d' }}>Admin</span>}
                </div>

                {/* PRIMARY NAVIGATION */}
                <div className="mb-3 px-3 mt-2">
                    <small className="text-muted fw-bold ms-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>MAIN MENU</small>
                </div>

                <Link href="/dashboard" className={`sidebar-link ${isActive('/dashboard')}`}>
                    <MdOutlineDashboard size={20} className="me-3" /> Dashboard
                </Link>

                <Link href="/leads" className={`sidebar-link ${isActive('/leads')}`}>
                    <MdLeaderboard size={20} className="me-3" /> Leads
                </Link>
                
                <Link href="/user-queries" className={`sidebar-link ${isActive('/user-queries')}`}>
                    <MdMessage size={20} className="me-3" /> User Queries
                </Link>

                <Link href="/estimator-for-home/setup" className={`sidebar-link ${isActive('/estimator-for-home/setup')}`}>
                    <FaCalculator size={20} className="me-3" /> Estimator Setup
                </Link>

                <Link href="/manage-job" className={`sidebar-link ${isActive('/manage-job')}`}>
                    <FaFileContract size={20} className="me-3" /> Manage Jobs
                </Link>
                
                <Link href="/job-application" className={`sidebar-link ${isActive('/job-application')}`}>
                    <FaRegUser size={20} className="me-3" /> Job Applications
                </Link>

                {isAdmin && (
                    <>
                        <Link href="/cms/team-management" className={`sidebar-link ${isActive('/cms/team-management')}`}>
                            <IoMdContacts size={20} className="me-3" /> System Users
                        </Link>
                        <Link href="/cms/popup-manager" className={`sidebar-link ${isActive('/cms/popup-manager')}`}>
                            <MdWeb size={20} className="me-3" /> Popup Manager
                        </Link>
                    </>
                )}


                {/* CMS SYSTEM ACCORDIONS */}
                <div className="mt-5 mb-2 px-3">
                    <small className="text-muted fw-bold ms-3" style={{ fontSize: '11px', letterSpacing: '1px' }}>CMS MANAGEMENT</small>
                </div>

                {/* 1. CORE SETUP & ADMIN (Moved to Top as requested) */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('coreSetup')}>
                    <div className="d-flex align-items-center"><MdOutlineSettings size={18} className="me-3"/> Core Setup</div>
                    {openGroups.coreSetup ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.coreSetup && (
                    <div className="sub-menu">
                        <Link href="/cms/pages" className={`sub-menu-link ${isActive('/cms/pages')}`}>Create Custom Page</Link>
                        <Link href="/cms/city" className={`sub-menu-link ${isActive('/cms/city')}`}>City Management</Link>
                        {/* <Link href="/cms/look_menu" className={`sub-menu-link ${isActive('/cms/look_menu')}`}>Look Menu Links</Link>
                        <Link href="/cms/footer_link" className={`sub-menu-link ${isActive('/cms/footer_link')}`}>Footer Links</Link> */}
                        <Link href="/cms/media-library" className={`sub-menu-link ${isActive('/cms/media-library')}`}>Media Library</Link>
                        <Link href="/cms/redirects" className={`sub-menu-link ${isActive('/cms/redirects')}`}>Redirects</Link>
                        
                        {isAdmin && (
                            <>
                                <Link href="/cms/seo_tag" className={`sub-menu-link ${isActive('/cms/seo_tag')}`}>Global SEO Tags</Link>
                                <Link href="/cms/robots-txt" className={`sub-menu-link ${isActive('/cms/robots-txt')}`}>Robots.txt Editor</Link>
                                <Link href="/cms/site-setting" className={`sub-menu-link ${isActive('/cms/site-setting')}`}>Global Site Settings</Link>
                            </>
                        )}
                    </div>
                )}

                {/* 2. HOMEPAGE GROUP */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('homepage')}>
                    <div className="d-flex align-items-center"><IoHomeOutline size={18} className="me-3"/> Homepage</div>
                    {openGroups.homepage ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.homepage && (
                    <div className="sub-menu">
                        <Link href="/cms/homepage-banner" className={`sub-menu-link ${isActive('/cms/homepage-banner')}`}>Hero Banner</Link>
                        <Link href="/cms/homePage-heading-management" className={`sub-menu-link ${isActive('/cms/homePage-heading-management')}`}>Home Page Headings</Link>
                        <Link href="/cms/home-about-video" className={`sub-menu-link ${isActive('/cms/home-about-video')}`}>Home Page About Us</Link>
                        <Link href="/cms/home-page-estimate-cards" className={`sub-menu-link ${isActive('/cms/home-page-estimate-cards')}`}>Estimate Cards</Link>
                        <Link href="/cms/home-page-content" className={`sub-menu-link ${isActive('/cms/home-page-content')}`}>Static Content Blocks</Link>
                        <Link href="/cms/manage-why-choose-us" className={`sub-menu-link ${isActive('/cms/manage-why-choose-us')}`}>Why Choose Us</Link>
                        <Link href="/cms/creating-the-home-of-your-dreams" className={`sub-menu-link ${isActive('/cms/creating-the-home-of-your-dreams')}`}>Creating Dreams</Link>
                        <Link href="/cms/manage-the-way-we-work" className={`sub-menu-link ${isActive('/cms/manage-the-way-we-work')}`}>The Way We Work</Link>
                        <Link href="/cms/manage-what-we-offer" className={`sub-menu-link ${isActive('/cms/manage-what-we-offer')}`}>Explore What We Offer</Link>
                        <Link href="/cms/manage-footer" className={`sub-menu-link ${isActive('/cms/manage-footer')}`}>Manage Footer</Link>
                        <Link href="/cms/manage-navbar-serving-area" className={`sub-menu-link ${isActive('/cms/manage-navbar-serving-area')}`}>Serving Areas NavBar</Link>
                    </div>
                )}

                {/* 3. GALLERIES & PORTFOLIOS */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('galleries')}>
                    <div className="d-flex align-items-center"><FaImages size={18} className="me-3"/> Galleries</div>
                    {openGroups.galleries ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.galleries && (
                    <div className="sub-menu">
                        <Link href="/cms/manage-banner" className={`sub-menu-link ${isActive('/cms/manage-banner')}`}>Manage Banner</Link>
                        <Link href="/cms/design-gallery" className={`sub-menu-link ${isActive('/cms/design-gallery')}`}>Design Gallery</Link>
                        <Link href="/cms/3d-gallery" className={`sub-menu-link ${isActive('/cms/3d-gallery')}`}>3D Gallery</Link>
                        <Link href="/cms/award-gallery" className={`sub-menu-link ${isActive('/cms/award-gallery')}`}>Award Gallery</Link>
                        <Link href="/cms/reallife-portfolio" className={`sub-menu-link ${isActive('/cms/reallife-portfolio')}`}>Real Time 3D</Link>
                        <Link href="/cms/portfolio-project/residential_projects" className={`sub-menu-link ${isActive('/cms/portfolio-project/residential_projects')}`}>Portfolio: Residential</Link>
                        <Link href="/cms/portfolio-project/luxury_projects" className={`sub-menu-link ${isActive('/cms/portfolio-project/luxury_projects')}`}>Portfolio: Luxury</Link>
                    </div>
                )}

                {/* 4. PRODUCTS & EXCLUSIVE DESIGN */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('products')}>
                    <div className="d-flex align-items-center"><IoLayersOutline size={18} className="me-3"/> Products & Design</div>
                    {openGroups.products ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.products && (
                    <div className="sub-menu">
                        <Link href="/cms/manage-heading-and-description" className={`sub-menu-link ${isActive('/cms/manage-heading-and-description')}`}>Heading & Description Management</Link>
                        <Link href="/cms/product" className={`sub-menu-link ${isActive('/cms/product')}`}>Main Products</Link>
                        <Link href="/cms/designer-choice" className={`sub-menu-link ${isActive('/cms/designer-choice')}`}>{`Designer's Choice`}</Link>
                        <Link href="/cms/sustainable-furniture" className={`sub-menu-link ${isActive('/cms/sustainable-furniture')}`}>Sustainable Furniture</Link>
                        <Link href="/cms/exclusive-design/furniture" className={`sub-menu-link ${isActive('/cms/exclusive-design/furniture')}`}>Furniture</Link>
                        <Link href="/cms/exclusive-design/space_saving_furniture" className={`sub-menu-link ${isActive('/cms/exclusive-design/space_saving_furniture')}`}>Space Saving</Link>
                        <Link href="/cms/exclusive-design/sustainable_furniture_rattan" className={`sub-menu-link ${isActive('/cms/exclusive-design/sustainable_furniture_rattan')}`}>Rattan</Link>
                        <Link href="/cms/exclusive-design/sustainable_furniture_reclaimed_wood" className={`sub-menu-link ${isActive('/cms/exclusive-design/sustainable_furniture_reclaimed_wood')}`}>Reclaimed Wood</Link>
                        <Link href="/cms/exclusive-design/wallpaper" className={`sub-menu-link ${isActive('/cms/exclusive-design/wallpaper')}`}>Wallpapers</Link>
                        <Link href="/cms/exclusive-design/ready_to_go_design" className={`sub-menu-link ${isActive('/cms/exclusive-design/ready_to_go_design')}`}>Ready To Go</Link>
                    </div>
                )}

                {/* 5. COMPANY & INFO */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('company')}>
                    <div className="d-flex align-items-center"><FaInfoCircle size={18} className="me-3"/> Company Info</div>
                    {openGroups.company ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.company && (
                    <div className="sub-menu">
                        <Link href="/cms/career" className={`sub-menu-link ${isActive('/cms/career')}`}>Career</Link>
                        <Link href="/cms/career-form" className={`sub-menu-link ${isActive('/cms/career-form')}`}>Career Form</Link>
                        <Link href="/cms/about-us" className={`sub-menu-link ${isActive('/cms/about-us')}`}>About Us</Link>
                        {/* <Link href="/cms/about-us-slider" className={`sub-menu-link ${isActive('/cms/about-us-slider')}`}>About Us Slider</Link> */}
                        <Link href="/cms/team" className={`sub-menu-link ${isActive('/cms/team')}`}>Team</Link>
                        <Link href="/cms/blog" className={`sub-menu-link ${isActive('/cms/blog')}`}>Blogs</Link>
                        <Link href="/cms/what-we-offer" className={`sub-menu-link ${isActive('/cms/what-we-offer')}`}>Redirects What We Offer</Link>
                        <Link href="/cms/how-its-works" className={`sub-menu-link ${isActive('/cms/how-its-works')}`}>How It Works</Link>
                        <Link href="/cms/manage-services" className={`sub-menu-link ${isActive('/cms/manage-services')}`}>Serving Areas</Link>
                        <Link href="/cms/refer-and-earn" className={`sub-menu-link ${isActive('/cms/refer-and-earn')}`}>Refer & Earn</Link>
                        <Link href="/cms/contact-us" className={`sub-menu-link ${isActive('/cms/contact-us')}`}>Contact Us</Link>
                        <Link href="/cms/manage-faicons" className={`sub-menu-link ${isActive('/cms/manage-faicons')}`}>Fav-Icons</Link>
                        <Link href="/cms/faqs" className={`sub-menu-link ${isActive('/cms/faqs')}`}>FAQs</Link>
                    </div>
                )}

                {/* 6. EXPERIENCE CENTERS */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('expCenters')}>
                    <div className="d-flex align-items-center"><FaStore size={18} className="me-3"/> Experience Centers</div>
                    {openGroups.expCenters ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.expCenters && (
                    <div className="sub-menu">
                        <Link href="/cms/experience-center" className={`sub-menu-link ${isActive('/cms/experience-center')}`}>Noida Center</Link>
                        <Link href="/cms/experience-center-gurugram" className={`sub-menu-link ${isActive('/cms/experience-center-gurugram')}`}>Gurugram Center</Link>
                        <Link href="/cms/experience-center-faridabad" className={`sub-menu-link ${isActive('/cms/experience-center-faridabad')}`}>Faridabad Center</Link>
                        <Link href="/cms/experience-center-noida-extension" className={`sub-menu-link ${isActive('/cms/experience-center-noida-extension')}`}>Noida Extension Center</Link>
                        <Link href="/cms/experience-center-new-delhi" className={`sub-menu-link ${isActive('/cms/experience-center-new-delhi')}`}>New Delhi Center</Link>
                        <Link href="/cms/experience-center-form" className={`sub-menu-link ${isActive('/cms/experience-center-form')}`}>Experience Form</Link>
                    </div>
                )}

                {/* 7. POLICIES */}
                <div className="sidebar-group-title" onClick={() => toggleGroup('policies')}>
                    <div className="d-flex align-items-center"><FaFileAlt size={18} className="me-3"/> Policies</div>
                    {openGroups.policies ? <FaChevronUp size={12}/> : <FaChevronDown size={12}/>}
                </div>
                {openGroups.policies && (
                    <div className="sub-menu">
                        <Link href="/cms/privacy-policy" className={`sub-menu-link ${isActive('/cms/privacy-policy')}`}>Privacy Policy</Link>
                        <Link href="/cms/term-and-condition" className={`sub-menu-link ${isActive('/cms/term-and-condition')}`}>Terms & Conditions</Link>
                        <Link href="/cms/cancellation-policy" className={`sub-menu-link ${isActive('/cms/cancellation-policy')}`}>Cancellation Policy</Link>
                        <Link href="/cms/warranty" className={`sub-menu-link ${isActive('/cms/warranty')}`}>Warranty Policy</Link>
                    </div>
                )}

                {/* LOGOUT */}
                <div className="mt-4 pt-4 border-top px-3 mb-5" style={{ borderColor: '#e2e8f0 !important' }}>
                    <a className="sidebar-link text-danger" onClick={handleLogout} style={{cursor: 'pointer', backgroundColor: '#fef2f2' }}>
                        <IoMdLogOut size={20} className="me-3" /> Log Out
                    </a>
                </div>

            </div>
        </div>
    );
}

export default AuthSidebar;