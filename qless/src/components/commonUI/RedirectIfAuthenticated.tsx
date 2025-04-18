import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { JSX } from "react";

export default function RedirectIfAuthenticated({children}: {children: JSX.Element}){
    const {user, loadingUser} = useUser();

    if(loadingUser) return null;

    if(user) {
        return user.is_manager ? <Navigate to="/manage" replace /> : <Navigate to="/cook" replace />;
    }

    return children;
}