"use client";

import { useState, useEffect } from "react";

export default function MainWrapper({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState));
        }

        const handleStorageChange = () => {
            const savedState = localStorage.getItem("sidebarCollapsed");
            if (savedState !== null) {
                setIsCollapsed(JSON.parse(savedState));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        
        const interval = setInterval(() => {
            const savedState = localStorage.getItem("sidebarCollapsed");
            if (savedState !== null) {
                const newState = JSON.parse(savedState);
                if (newState !== isCollapsed) {
                    setIsCollapsed(newState);
                }
            }
        }, 100);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [isCollapsed]);

    return (
        <div className={`transition-all duration-300 pb-20 lg:pb-0 lg:${isCollapsed ? 'ml-20' : 'ml-64'}`}>
            {children}
        </div>
    );
}
