"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '../../../store/slices/authSlice';
import { FaBars, FaSignOutAlt, FaClock } from 'react-icons/fa';

const AuthHeader = ({ setIsSidebarOpen }) => {
    const { isLoggedIn, user, authToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(null);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        router.push('/login');
    }, [dispatch, router]);

    // 🧠 Generate initials (keep it simple and reliable)
    const getInitials = (name = "") => {
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0]?.toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    // 🕒 Decode JWT and manage session countdown
    useEffect(() => {
        if (!isLoggedIn || !authToken) return;

        // Function to safely decode JWT and get expiration time
        const getExpTime = (token) => {
            try {
                // Replace characters to make valid base64, then decode
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                return payload.exp * 1000; // Convert to milliseconds
            } catch (e) {
                console.error("Error decoding token for timer", e);
                return null;
            }
        };

        const expTimeMs = getExpTime(authToken);
        if (!expTimeMs) return;

        const updateTimer = () => {
            const now = Date.now();
            const remainingMs = expTimeMs - now;

            if (remainingMs <= 0) {
                // Time is up, force logout
                setTimeLeft(0);
                handleLogout();
            } else {
                setTimeLeft(remainingMs);
            }
        };

        updateTimer(); // Initial call
        const intervalId = setInterval(updateTimer, 1000); // Tick every second

        return () => clearInterval(intervalId);
    }, [isLoggedIn, authToken, handleLogout]);

    // Format milliseconds into HH:MM:SS
    const formatTime = (ms) => {
        if (ms === null) return "";
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <header className="cms-header shadow-sm border-bottom bg-white d-flex align-items-center justify-content-between px-4">
            
            {/* LEFT: Logo */}
            <div className="d-flex align-items-center">
                <a href="/dashboard" className="text-decoration-none d-flex align-items-center gap-2">
                    <img 
                        src="/images/iconsHC.png" 
                        style={{ height: "45px", objectFit: "contain" }} 
                        alt="hc-logo" 
                    decoding="async" />
                      {timeLeft !== null && (
                            <div 
                                className={`d-flex align-items-center gap-1 fw-bold px-3 py-1 rounded bg-light border ${timeLeft < 900000 ? 'text-danger border-danger border-opacity-50 bg-danger bg-opacity-10' : 'text-muted'}`} 
                                title="Time remaining before automatic logout"
                            >
                                <FaClock size={14} />
                                <span style={{ fontSize: '0.85rem' }}>Session Expires in : {formatTime(timeLeft)}</span>
                            </div>
                        )}
                </a>
            </div>

            {/* RIGHT: User Section */}
            {isLoggedIn && (
                <div className="d-flex align-items-center gap-3">
                    
                    {/* Mobile Hamburger */}
                    <button 
                        className="btn btn-light d-md-none border" 
                        onClick={() => setIsSidebarOpen(prev => !prev)}
                    >
                        <FaBars />
                    </button>

                    {/* Desktop Actions */}
                    <div className="d-none d-md-flex align-items-center gap-3">
                        
                        {/* ⏳ Session Timer */}
                      

                        {/* 👤 Profile Block */}
                        <div className="d-flex align-items-center gap-2 border-start ps-3">
                            
                            {user?.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt="profile"
                                    className="rounded-circle"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        objectFit: "cover"
                                    }}
                                decoding="async" />
                            ) : (
                                <div className="initials-circle shadow-sm">
                                    {getInitials(user?.firstName || "Admin")}
                                </div>
                            )}

                            <span className="text-dark fw-semibold">
                                {`${user?.firstName} ${user?.lastName}`|| "Admin"}
                            </span>
                        </div>

                        {/* 🚪 Logout */}
                        <button 
                            className="btn btn-outline-danger btn-sm fw-bold d-flex align-items-center gap-2 px-3 py-2 ms-2 transition-all hover-shadow" 
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Styles */}
            <style jsx>{`
                .cms-header {
                    position: sticky;
                    top: 0;
                    height: 70px;
                    z-index: 1050;
                }

                .initials-circle {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    background-color: #0d6efd;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                }
                
                .hover-shadow:hover {
                    box-shadow: 0 4px 6px -1px rgba(220, 53, 69, 0.2);
                }
            `}</style>
        </header>
    );
};

export default AuthHeader;