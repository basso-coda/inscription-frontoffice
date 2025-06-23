import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export const useAuth = () => {
    const app = useContext(AppContext);
// console.log('umuntu ari connecté', app.user);

    return {
        user: {
            data: app.user,
            hasPermission: (role) => {
                if (!role) return false;

                // const roles = app.user?.PROFIL.map(profil => [...profil.ROLES]).flat();
                const roles = app.user?.profil?.ROLES?.flat();

                return Boolean(roles?.find(r => r.DESCRIPTION === role))
            }
        },
        handleLogin: app.handleLogin,
        handleLogout: app.handleLogout
    }
};