import { useEffect, useRef } from "react";
import RoutesProvider from "./routes/RoutesProvider";
import { Toast } from "primereact/toast";

// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import { history } from "./helpers/history";

import { useApp } from "./hooks/useApp";
import { useNavigate } from "react-router-dom";
import { IntlProvider } from "react-intl";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

import "/node_modules/primeflex/primeflex.css";
import 'primeicons/primeicons.css';
import "./App.css";

import frenchMessages from '@/locales/fr.json';
import englishMessages from '@/locales/en.json';

function App() {
  const toastRef = useRef(null);
  const { toast: appToast, setToastAction, locale } = useApp();

  history.navigate = useNavigate();
  history.toast = toastRef;

  useEffect(() => {
    if (appToast) {
      toastRef.current.show(appToast);
    }
  }, [appToast]);

  return (
    <IntlProvider
      messages={locale === 'fr' ? frenchMessages : englishMessages}
      locale={locale}
      defaultLocale="en"
    >
      <Toast
        ref={toastRef}
        position="top-center"
        onHide={() => {
          setToastAction(null);
        }}
      />

      <RoutesProvider />

    </IntlProvider>
  )
}

export default App;
