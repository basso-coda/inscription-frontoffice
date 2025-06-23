import { Route } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRouter";
import PaiementConfirmation from "@/pages/candidatures/paiement/PaiementConfirmation";
import AfripayButton from "@/pages/candidatures/paiement/AfripayButton";

export const paiement_routes_items = {
    paiement_confirmation: {
        path: "paiement-confirmation",
        name: "Confirmation du paiement",
        component: PaiementConfirmation
    },

    afripay_button: {
        path: "afripay-button-payment/:ID_CANDIDATURE",
        name: "Paiement par Afripay",
        component: AfripayButton
    }
    

};

let paiement_routes = [];

for (let key in paiement_routes_items) {

  const route = paiement_routes_items[key];

  paiement_routes.push(
    <Route path={route.path} element={<ProtectedRoute><route.component /></ProtectedRoute>} key={route.path} />
  );
}

export default paiement_routes;
