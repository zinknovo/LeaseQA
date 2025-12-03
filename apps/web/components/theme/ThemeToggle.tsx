"use client";

import {useTheme} from "./ThemeProvider";

export function ThemeToggle() {
    const {theme, toggleTheme} = useTheme();
    const isLight = theme === "light";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/20"
        >
            {isLight ? (
                <>
                    <SunIcon/>
                    Light
                </>
            ) : (
                <>
                    <MoonIcon/>
                    Dark
                </>
            )}
        </button>
    );
}

function SunIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 5V3m0 18v-2m7-7h2M3 12h2m12.95 6.95 1.414 1.414M4.636 4.636 6.05 6.05m12.9-1.414-1.414 1.414M6.05 17.95l-1.414 1.414M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
            />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M21 15.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 12.5Z"
            />
        </svg>
    );
}
