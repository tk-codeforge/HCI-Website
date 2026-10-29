"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 13+
import { useSelector } from "react-redux";
import AuthFooter from "./AuthFooter";
import AuthHeader from "./AuthHeader";
import AuthSidebar from "./AuthSidebar";
import { useHasMounted } from "../../../utils/useHasMounted";

const AuthMainLayout = ({ children }) => {
    const hasMounted = useHasMounted(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isLoggedIn } = useSelector((state) => state.auth); // ✅ Always call hooks at the top
    const router = useRouter();

    useEffect(() => {
        if (hasMounted && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, router, hasMounted]);

    if (!hasMounted || !isLoggedIn) return null; // ✅ Moved outside of hooks to avoid breaking React rules

    return (
        <div className="page-container">
            <AuthHeader setIsSidebarOpen={setIsSidebarOpen} />
            <main>
                <section>
                    <div className="px-4 container-fluid admin-layout-container">
                        <div className="row admin-layout-row">
                            <div className={`col-md-3 d-md-block sidebar ${isSidebarOpen ? 'show' : 'collapse'} sticky-sidebar my_admin_sidebar_parent`}>
                                <AuthSidebar />
                            </div>
                            <div className="col-md-9 px-md-4 admin-main-content">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <AuthFooter />

            <style jsx global>{`
                .sticky-sidebar {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    height: 100vh;
                    overflow-y: auto;
                }

                /* Keep the dashboard sidebar at the same desktop width across pages. */
                @media (min-width: 768px) {
                    .admin-layout-row {
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: stretch;
                    }

                    .admin-layout-row > .my_admin_sidebar_parent {
                        flex: 0 0 25% !important;
                        width: 25% !important;
                        max-width: 25% !important;
                        min-width: 0;
                    }

                    .admin-layout-row > .admin-main-content {
                        flex: 0 0 75% !important;
                        width: 75% !important;
                        max-width: 75% !important;
                        min-width: 0;
                        margin-left: 0 !important;
                    }
                }

                @media (max-width: 767.98px) {
                    .admin-layout-row {
                        flex-wrap: wrap;
                    }

                    .admin-layout-row > .my_admin_sidebar_parent,
                    .admin-layout-row > .admin-main-content {
                        width: 100%;
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default AuthMainLayout;