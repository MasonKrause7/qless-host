import { useUser } from "../../hooks/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const { user, loadingUser } = useUser();
    const location = useLocation();
    const path = location.pathname;
    if (loadingUser) return null;

    if (!user) {
        return <Navigate to='/' replace />
    }

    const isManager = user.is_manager;
    const isCook = !isManager;


    //manager has full access
    if (isManager) {
        return <Outlet />;
    }

    //cook can only access cook-related pages
    if (isCook && path.startsWith("/cook")) { return <Outlet /> };

    //redirect if cook attempts to access unautorized page
    return <Navigate to="/cook" replace />;
}