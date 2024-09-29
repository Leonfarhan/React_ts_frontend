import React, { useState, useEffect, useContext } from "react";

interface User {
    id: number;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    role: string | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider:
    React.FC<React.PropsWithChildren< Record<string, unknown>>> =  ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const storedRole = localStorage.getItem('role');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setRole(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, role, setRole, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}