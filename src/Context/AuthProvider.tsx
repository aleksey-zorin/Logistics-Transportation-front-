import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type User = {
    id: number;
    email: string;
    role: "Admin" | "Operator" | "User";
    userName?: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    setUser: (u: User | null) => void;
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, []);

    return(
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};