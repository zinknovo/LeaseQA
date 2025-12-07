import NavTabs from "./components/NavTabs";
import React from "react";

export default function QALayout({children}: {children: React.ReactNode}) {
    return (
        <div className="mb-2">
            <NavTabs />
            {children}
        </div>
    );
}
