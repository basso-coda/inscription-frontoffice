import { Route } from "react-router-dom";
import ProfisListPage from "@/pages/administrations/profils/ProfilListPage";
import { ProtectedRoute } from "../ProtectedRouter";

export const profils_routes_items = {
  profils: {
    path: "profils",
    name: "Profils",
    component: ProfisListPage,
  },

};

let profils_routes = [];

for (let key in profils_routes_items) {

  const route = profils_routes_items[key];

  profils_routes.push(
    <Route path={route.path} element={<ProtectedRoute><route.component /></ProtectedRoute>} key={route.path} />
  );
}

export default profils_routes;
