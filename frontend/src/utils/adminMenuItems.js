// Single source of truth for the admin search bar.
// Add a new page here and it becomes searchable automatically.
// adminOnly: true => only shown to users with role "admin"
export const ADMIN_MENU_ITEMS = [
    // MAIN MENU
    { name: "Dashboard", url: "/dashboard", group: "Main Menu" },
    { name: "Leads", url: "/leads", group: "Main Menu" },
    { name: "User Queries", url: "/user-queries", group: "Main Menu" },
    { name: "Estimator Setup", url: "/estimator-for-home/setup", group: "Main Menu" },
    { name: "Manage Jobs", url: "/manage-job", group: "Main Menu" },
    { name: "Job Applications", url: "/job-application", group: "Main Menu" },
    { name: "System Users", url: "/cms/team-management", group: "Main Menu", adminOnly: true },
    { name: "Popup Manager", url: "/cms/popup-manager", group: "Main Menu", adminOnly: true },

    // CORE SETUP
    { name: "Create Custom Page", url: "/cms/pages", group: "Core Setup" },
    { name: "City Management", url: "/cms/city", group: "Core Setup" },
    { name: "Media Library", url: "/cms/media-library", group: "Core Setup" },
    { name: "Redirects", url: "/cms/redirects", group: "Core Setup" },
    { name: "Global SEO Tags", url: "/cms/seo_tag", group: "Core Setup", adminOnly: true },
    { name: "Robots.txt Editor", url: "/cms/robots-txt", group: "Core Setup", adminOnly: true },
    { name: "Global Site Settings", url: "/cms/site-setting", group: "Core Setup", adminOnly: true },
    { name: "Slug Settings", url: "/cms/slug-settings", group: "Core Setup", adminOnly: true },

    // HOMEPAGE
    { name: "Hero Banner", url: "/cms/homepage-banner", group: "Homepage" },
    { name: "Home Page Headings", url: "/cms/homePage-heading-management", group: "Homepage" },
    { name: "Home Page About Us", url: "/cms/home-about-video", group: "Homepage" },
    { name: "Estimate Cards", url: "/cms/home-page-estimate-cards", group: "Homepage" },
    { name: "Static Content Blocks", url: "/cms/home-page-content", group: "Homepage" },
    { name: "Why Choose Us", url: "/cms/manage-why-choose-us", group: "Homepage" },
    { name: "Creating Dreams", url: "/cms/creating-the-home-of-your-dreams", group: "Homepage" },
    { name: "Design Your Dream Space", url: "/cms/design-your-dream-space", group: "Homepage" },
    { name: "The Way We Work", url: "/cms/manage-the-way-we-work", group: "Homepage" },
    { name: "Explore What We Offer", url: "/cms/manage-what-we-offer", group: "Homepage" },
    { name: "Factory", url: "/cms/homePage-furniture-factory", group: "Homepage" },
    { name: "Manage Header", url: "/cms/manage-header", group: "Homepage" },
    { name: "Manage Footer", url: "/cms/manage-footer", group: "Homepage" },

    // GALLERIES
    { name: "Design Gallery", url: "/cms/design-gallery", group: "Galleries" },
    { name: "3D Gallery", url: "/cms/3d-gallery", group: "Galleries" },
    { name: "Award Gallery", url: "/cms/award-gallery", group: "Galleries" },
    { name: "Real Time 3D", url: "/cms/reallife-portfolio", group: "Galleries" },
    { name: "Portfolio: Residential", url: "/cms/portfolio-project/residential_projects", group: "Galleries" },
    { name: "Portfolio: Luxury", url: "/cms/portfolio-project/luxury_projects", group: "Galleries" },

    // PRODUCTS & DESIGN
    { name: "Manage Banner", url: "/cms/manage-banner", group: "Products & Design" },
    { name: "Manage Heading, Description and Banner", url: "/cms/manage-heading-and-description", group: "Products & Design" },
    { name: "Main Products", url: "/cms/product", group: "Products & Design" },
    { name: "Designer's Choice", url: "/cms/designer-choice", group: "Products & Design" },
    { name: "Sustainable Furniture", url: "/cms/sustainable-furniture", group: "Products & Design" },
    { name: "Furniture", url: "/cms/exclusive-design/furniture", group: "Products & Design" },
    { name: "Space Saving", url: "/cms/exclusive-design/space_saving_furniture", group: "Products & Design" },
    { name: "Rattan", url: "/cms/exclusive-design/sustainable_furniture_rattan", group: "Products & Design" },
    { name: "Reclaimed Wood", url: "/cms/exclusive-design/sustainable_furniture_reclaimed_wood", group: "Products & Design" },
    { name: "Wallpapers", url: "/cms/exclusive-design/wallpaper", group: "Products & Design" },
    { name: "Ready To Go", url: "/cms/exclusive-design/ready_to_go_design", group: "Products & Design" },

    // COMPANY INFO
    { name: "Career", url: "/cms/career", group: "Company Info" },
    { name: "Career Form", url: "/cms/career-form", group: "Company Info" },
    { name: "About Us", url: "/cms/about-us", group: "Company Info" },
    { name: "Team", url: "/cms/team", group: "Company Info" },
    { name: "Blogs", url: "/cms/blog", group: "Company Info" },
    { name: "Redirects What We Offer", url: "/cms/what-we-offer", group: "Company Info" },
    { name: "How It Works", url: "/cms/how-its-works", group: "Company Info" },
    { name: "Serving Areas", url: "/cms/manage-services", group: "Company Info" },
    { name: "Refer & Earn", url: "/cms/refer-and-earn", group: "Company Info" },
    { name: "Contact Us", url: "/cms/contact-us", group: "Company Info" },
    { name: "Fav-Icons", url: "/cms/manage-faicons", group: "Company Info" },
    { name: "FAQs", url: "/cms/faqs", group: "Company Info" },

    // EXPERIENCE CENTERS
    { name: "Custom Experience Center", url: "/cms/custom-experience-center", group: "Experience Centers" },
    { name: "Noida Center", url: "/cms/experience-center", group: "Experience Centers" },
    { name: "Gurugram Center", url: "/cms/experience-center-gurugram", group: "Experience Centers" },
    { name: "Faridabad Center", url: "/cms/experience-center-faridabad", group: "Experience Centers" },
    { name: "Noida Extension Center", url: "/cms/experience-center-noida-extension", group: "Experience Centers" },
    { name: "New Delhi Center", url: "/cms/experience-center-new-delhi", group: "Experience Centers" },
    { name: "Experience Form", url: "/cms/experience-center-form", group: "Experience Centers" },
    { name: "Thank You Page", url: "/cms/thank-you", group: "Experience Centers" },

    // POLICIES
    { name: "Privacy Policy", url: "/cms/privacy-policy", group: "Policies" },
    { name: "Terms & Conditions", url: "/cms/term-and-condition", group: "Policies" },
    { name: "Cancellation Policy", url: "/cms/cancellation-policy", group: "Policies" },
    { name: "Warranty Policy", url: "/cms/warranty", group: "Policies" },
];
