import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRouter";
import EditProfilPage from "@/pages/auth/EditProfilPage";
import ViewUtilisateurPage from "@/pages/administrations/utilisateurs/ViewUtilisateurPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";

export const auth_routes_items = {
  profil: {
    path: "auth/edit-profil",
    name: "Modifier le profil",
    component: EditProfilPage,
  },

  password: {
    path: "auth/change-password",
    name: "Changer mot de passe",
    component: ChangePasswordPage,
  },

  voir_profil: {
    path: "auth/view-profil",
    name: "Voir le profil",
    component: ViewUtilisateurPage,
  },
};

let auth_routes = [];

for (let key in auth_routes_items) {

  const route = auth_routes_items[key];

  auth_routes.push(
    <Route path={route.path} element={<ProtectedRoute><route.component /></ProtectedRoute>} key={route.path} />
  );
}

export default auth_routes;
