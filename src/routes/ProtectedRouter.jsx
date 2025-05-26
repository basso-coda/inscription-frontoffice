import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import isTokenExpired from "@/helpers/isTokenExpired";
import { useApp } from "@/hooks/useApp";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }) => {

    const { user, handleLogout } = useAuth();
    const { setToastAction } = useApp();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (!user.data) {
            navigate('/', {
                replace: true,
                state: { from: location }
            })
        }

        if (user.data && isTokenExpired(user.data?.token)) {

            setToastAction({
                severity: "error",
                summary: "Erreur",
                detail: "Session expirée",
                life: 3000,
            })

            handleLogout()

            navigate('/', {
                replace: true,
                state: { from: location }
            })

        }
    }, [user])

    return children;
};