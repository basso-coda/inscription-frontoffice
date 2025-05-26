import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { utilisateurs_routes_items } from "@/routes/administrations/utilisateurs_routes";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useApp } from "@/hooks/useApp";
import fetchApi from "@/helpers/fetchApi";
import { InputSwitch } from "primereact/inputswitch";
import Loading from "@/components/app/Loading";
import { formatDate } from "@/helpers/formatter";

export default function HistoriqueUtilisateurListPage() {
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [utilisateurs, setUtilisateurs] = useState([]);

  const { setBreadCrumbAction } = useApp()

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    search: "",
  });

  const onPage = (event) => {
    setlazyState(event);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onFilter = (event) => {
    event["first"] = 0;
    setlazyState(event);
  };

  const fetchUtilisateurs = useCallback(async () => {
    try {
      setLoading(true)
      const baseurl = `/historique-utilisateur?`
      var url = baseurl
      for (let key in lazyState) {
        const value = lazyState[key]
        if (value) {
          if (typeof (value) == 'object') {
            url += `${key}=${JSON.stringify(value)}&`
          } else {
            url += `${key}=${value}&`
          }
        }
      }

      const { data } = await fetchApi(url);
      setUtilisateurs(data.rows);
      setTotalRecords(data.count);
    } catch (response) {
      // console.log(response)

    } finally {
      setLoading(false);
    }
  }, [lazyState]);

  useEffect(() => {

    document.title = utilisateurs_routes_items.historique_utilisateurs.name;

    setBreadCrumbAction([utilisateurs_routes_items.historique_utilisateurs])

    return () => {
      setBreadCrumbAction([]);
    };
  }, []);

  useEffect(() => {
    fetchUtilisateurs();
  }, [lazyState]);

  return (
    <>

      {loading && <Loading />}

      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Historique des utilisateurs</h1>

        </div>
        <div className="shadow my-2 bg-white p-3 rounded d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="p-input-icon-left">

              <i className="pi pi-search ml-2" />

              <InputText
                type="search"
                placeholder="Recherche"
                className="p-inputtext-sm"
                style={{ minWidth: 250, textIndent: '20px' }}
                onInput={(e) =>
                  setlazyState((s) => ({ ...s, search: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={utilisateurs}
              tableStyle={{ minWidth: "50rem" }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun historique trouvé"
              first={lazyState.first}
              rows={lazyState.rows}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={onSort}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              onFilter={onFilter}
              filters={lazyState.filters}
              loading={loading}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
            >

              <Column
                field="UTILISATEUR_ID"
                frozen
                header="Nom et prenom"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.utilisateur.NOM} {item.utilisateur.PRENOM}
                    </span>
                  );
                }}
              />
              <Column
                field="COMMENTAIRE"
                header="Commentaire"
                frozen
                sortable
              />

              <Column
                field="IS_ACTIVE"
                header="Statut"
                body={(item) => {
                  return (
                    <InputSwitch pt={{ slider: { className: item.STATUT_ID ? 'bitwi-button' : '' } }} checked={Boolean(item.STATUT_ID)} />
                  );
                }}
              />

              <Column
                field="PROFIL_ID"
                header="Profil"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.profil.DESCRIPTION}
                    </span>
                  );
                }}
              />

              <Column
                field="USER_ID"
                header="Auteur"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.titulaire.NOM} {item.titulaire.PRENOM}
                    </span>
                  );
                }}
              />

              <Column
                field="DATE_INSERTION"
                header="Date insertion"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {formatDate(item.DATE_INSERTION)}
                    </span>
                  );
                }}
              />

            </DataTable>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
