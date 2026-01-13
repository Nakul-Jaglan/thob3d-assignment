"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/services/api";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/users/me");
            const fetchedUser = data.user;
            setUser(fetchedUser || null);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            Cookies.remove("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get("token");
        const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/ai/login") || pathname.startsWith("/ai/register");
        const isPublicPage = isAuthPage || pathname === "/" || pathname === "/home" || pathname === "/ai/home";
        const isAiPage = pathname.startsWith("/ai/");

        if (!loading && !token && !isPublicPage && !isAiPage) {
            router.push("/login");
        }

        if (!loading && !token && !isPublicPage && isAiPage) {
            router.push("/ai/login");
        }

        if (!loading && token && isAuthPage && !isAiPage) {
            router.push("/dashboard");
        }

        if (!loading && token && isAuthPage && isAiPage) {
            router.push("/ai/dashboard");
        }
    }, [loading, pathname, router]);

    const login = (userData, token) => {
        // Session cookie: no 'expires' specified
        Cookies.set("token", token, { secure: true, sameSite: "strict" });
        setUser(userData);
        router.push("/dashboard");
    };

    const logout = () => {
        Cookies.remove("token");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);