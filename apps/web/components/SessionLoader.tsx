"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSession } from "@/app/lib/api";
import { setSession, signOut } from "@/app/store";

export default function SessionLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSession = async () => {
            console.log("[SessionLoader] Attempting to fetch session...");
            try {
                const user = await fetchSession();
                console.log("[SessionLoader] Session fetched successfully:", user);
                if (user) {
                    dispatch(setSession(user));
                }
            } catch (error) {
                console.warn("[SessionLoader] Failed to fetch session (not logged in):", error);
                dispatch(signOut());
            }
        };

        loadSession();
    }, [dispatch]);

    return <>{children}</>;
}
