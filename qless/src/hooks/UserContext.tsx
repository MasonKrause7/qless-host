import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../App";
import { getUser, signIn, signOut } from "../service/supabaseService";

type UserContextType = {
    user: User | null;
    loadingUser: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);

    //on mount, fetch current user if applicable
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getUser();
            setUser(currentUser);
            setLoadingUser(false);
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string): Promise<User | null> => {
        setLoadingUser(true);
        const loggedInUser = await signIn(email, password);
        if(loggedInUser) setUser(loggedInUser);
        setLoadingUser(false);
        return loggedInUser;
    };

    const logout = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, loadingUser, login, logout}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(){
    const context = useContext(UserContext);
    if(context === undefined){
        throw new Error("useUser must be used with an UserProvider");
    }
    return context;
}