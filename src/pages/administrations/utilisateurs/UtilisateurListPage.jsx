import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { utilisateurs_routes_items } from "@/routes/administrations/utilisateurs_routes";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Image } from "primereact/image";
import { useApp } from "@/hooks/useApp";
import fetchApi from "@/helpers/fetchApi";
import { Menu } from "primereact/menu";
import { Avatar } from "primereact/avatar";
import { InputSwitch } from "primereact/inputswitch";
import Loading from "@/components/app/Loading";
import UtilisateurActivationDialog from "./Dialogs/UtilisateurActivationDialog";
import { useAuth } from "@/hooks/useAuth";

export default function UtilisateursListPage() {

  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);
  const [visible, setVisible] = useState(false)

  // utilisateur connecté
  const { user } = useAuth()

  const menu = useRef(null);

  const { setBreadCrumbAction } = useApp()

  const navigate = useNavigate();

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

  const handleActiverUtilisateur = (e, item) => {
    if (!inViewMenuItem) {
      setInViewMenuItem(item)
    }

    setVisible(true)
  };

  const fetchUtilisateurs = useCallback(async () => {
    try {
      setLoading(true)
      const baseurl = `/utilisateurs?`
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
      const list = data.rows;

      // Exclure l'utilisateur connecté
      const filteredUsers = list.filter(u => u.ID_UTILISATEUR !== user.data?.ID_UTILISATEUR);

      setUtilisateurs(filteredUsers);
      setTotalRecords(filteredUsers.length);
    } catch (response) {
      // console.log(response)

    } finally {
      setLoading(false);
    }
  }, [lazyState]);

  useEffect(() => {

    document.title = utilisateurs_routes_items.utilisateurs.name;

    setBreadCrumbAction([utilisateurs_routes_items.utilisateurs])

    return () => {
      setBreadCrumbAction([]);
    };
  }, []);

  useEffect(() => {
    fetchUtilisateurs();
  }, [lazyState]);

  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />

      {visible && <UtilisateurActivationDialog
        visible={visible}
        data={inViewMenuItem}
        onHide={() => { setVisible(false); setInViewMenuItem(null) }}
        fetchUtilisateurs={fetchUtilisateurs}
      />}

      {loading && <Loading />}

      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Utilisateurs</h1>
          <Button
            label="Nouvel utilisateur "
            className="bitwi-button"
            icon="pi pi-plus"
            size="small"
            onClick={() => {
              navigate("/utilisateurs/new");
            }}
          />
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
              emptyMessage="Aucun utilisateurs trouvé"
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
                header="Image"
                frozen
                body={(item) => {

                  return item.IMAGE ? <Image
                    src={`${item.IMAGE}`}
                    alt="Image"
                    className="rounded-5"
                    imageClassName="rounded-5 object-fit-cover"
                    imageStyle={{ width: "64px", height: "64px" }}
                    preview
                  />

                    : <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                }}
              />
              <Column
                field="NOM"
                frozen
                header="Nom et prenom"
                sortable
                body={(item) => {
                  return (
                    <span>
                      {item.NOM} {item.PRENOM}
                    </span>
                  );
                }}
              />
              <Column
                field="EMAIL"
                header="Email"
                sortable
              />
              <Column
                field="USERNAME"
                header="Username"
                sortable
              />
              <Column
                field="IS_ACTIVE"
                frozen
                header="Statut"
                body={(item) => {
                  return (
                    <InputSwitch pt={{ slider: { className: item.IS_ACTIVE ? 'bitwi-button' : '' } }} checked={Boolean(item.IS_ACTIVE)} onChange={e => handleActiverUtilisateur(e, item)} />
                  );
                }}
              />
              <Column
                field=""
                header=""
                alignFrozen="right"
                frozen
                body={(item) => {
                  let items = [
                    {
                      label: 'Plus de details',
                      items: [{
                        label: 'Détail',
                        icon: 'pi pi-eye',
                        template: item => (
                          <div className='p-menuitem-content px-3'>
                            <Link to={`/utilisateurs/profil/${inViewMenuItem?.ID_UTILISATEUR}`} className="flex align-items-center p-2" style={{ textDecoration: "none", color: '#3d3d3d' }}>
                              <span className={item.icon} />
                              <span className="mx-2">{item.label}</span>
                            </Link>
                          </div>
                        )
                      }, {
                        label: 'Modifier',
                        icon: 'pi pi-pencil',
                        template: item => (
                          <div className='p-menuitem-content px-3'>
                            <Link to={`/utilisateurs/edit/${inViewMenuItem?.ID_UTILISATEUR}`} className="flex align-items-center p-2" style={{ textDecoration: "none", color: '#3d3d3d' }}>
                              <span className={item.icon} />
                              <span className="mx-2">{item.label}</span>
                            </Link>
                          </div>
                        )
                      },
                      {
                        label: 'Supprimer',
                        icon: 'pi pi-trash',
                        template: item => (
                          <div className='p-menuitem-content px-3'>
                            <a href={'#'} onClick={e => handleActiverUtilisateur(e, inViewMenuItem)} className="flex align-items-center p-2" style={{ textDecoration: "none", color: '#3d3d3d' }}>
                              <span className={`${item.icon} text-danger`} />
                              <span className="mx-2 text-danger">{item.label}</span>
                            </a>
                          </div>
                        )
                      },]
                    },
                  ];
                  return (
                    <>
                      <Menu model={items} onHide={() => setInViewMenuItem(null)} popup ref={menu} id="popup_menu_right" popupAlignment="right" />

                      <Button
                        aria-label="Menu"
                        size="small"
                        label="Options"
                        icon="pi pi-angle-down"
                        iconPos="right"
                        className="mx-1 p-1 bitwi-button rounded-button"
                        onClick={(event) => {
                          setInViewMenuItem(item);
                          menu.current.toggle(event);
                        }}
                      />
                    </>
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
