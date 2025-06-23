import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRouter";
import DemandeInscription from "@/pages/candidatures/DemandeInscription";
import ListDemandes from "@/pages/candidatures/ListDemandes";
import ViewDemande from "@/pages/candidatures/ViewDemande";

export const demande_inscription_routes_items = {
    demande_inscription: {
        path: "demande-inscription",
        name: "Demande d'inscription",
        component: DemandeInscription
    },

    list_demande: {
        path: "list-demande",
        name: "Liste de mes demandes",
        component: ListDemandes
    },

    view_demande: {
        path: "view-demande/:ID_CANDIDATURE",
        name: "Details",
        component: ViewDemande
    }

};

let demande_inscription_routes = [];

for (let key in demande_inscription_routes_items) {

  const route = demande_inscription_routes_items[key];

  demande_inscription_routes.push(
    <Route path={route.path} element={<ProtectedRoute><route.component /></ProtectedRoute>} key={route.path} />
  );
}

export default demande_inscription_routes;
