import "react";
import { Navigate } from "react-router-dom";
import { auth } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const RouteProteger = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default RouteProteger;
