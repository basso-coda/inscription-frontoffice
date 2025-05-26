import { Route } from "react-router-dom";
import RolesListPage from "@/pages/administrations/roles/RoleListPage";
import { ProtectedRoute } from "../ProtectedRouter";

export const roles_routes_items = {
  roles: {
    path: "roles",
    name: "roles",
    component: RolesListPage,
  },

};

let roles_routes = [];

for (let key in roles_routes_items) {

  const route = roles_routes_items[key];

  roles_routes.push(
    <Route path={route.path} element={<ProtectedRoute><route.component /></ProtectedRoute>} key={route.path} />
  );
}

export default roles_routes;
