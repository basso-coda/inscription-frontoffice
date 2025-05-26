import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { roles_routes_items } from "@/routes/administrations/roles_routes";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useApp } from "@/hooks/useApp";
import fetchApi from "@/helpers/fetchApi";
import { Menu } from "primereact/menu";
import NewRoleModal from "./components/NewRoleModal";
import { InputSwitch } from "primereact/inputswitch";

export default function RoleListPage() {
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [roles, setRoles] = useState([]);
  const [selectedItems, setSelectedItems] = useState(null);
  const [inViewMenuItem, setInViewMenuItem] = useState(null);
  const [addVisible, setAddVisible] = useState(false);

  const { setToastAction } = useApp();

  const menu = useRef(null);

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

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelectedItems(value);
    setSelectAll(value.length === totalRecords);
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      setSelectAll(true);
      setSelectedItems(roles);
    } else {
      setSelectAll(false);
      setSelectedItems([]);
    }
  };

  const deleteItems = async (itemsIds) => {
    try {
      const form = new FormData();
      form.append("ID_ROLES", JSON.stringify(Array.isArray(itemsIds) ? itemsIds : [itemsIds.ID_ROLE]));
      const res = await fetchApi(
        "/roles/delete",
        {
          method: "POST",
          body: form,
        }
      );

      setToastAction({
        severity: "success",
        summary: "Utilisateur supprimé",
        detail: res.message,
        life: 3000,
      })

      fetchRoles();
      setSelectAll(false);
      setSelectedItems(null);
    } catch (error) {
      console.log(error);
      setToastAction({
        severity: "error",
        summary: "Erreur du système",
        detail: "Erreur du système, réessayez plus tard",
        life: 3000,
      })
    } finally {
    }
  };

  const handleDeletePress = (e, itemsids) => {
    e.preventDefault();
    e.stopPropagation();
    confirmDialog({
      header: "Supprimer ?",
      message: (
        <div className="d-flex flex-column align-items-center">
          {!Array.isArray(itemsids) ? (
            <>
              <div className="font-bold text-center my-2">
                {itemsids?.DESCRIPTION}
              </div>
              <div className="text-center">
                Voulez-vous vraiment supprimer ?
              </div>
            </>
          ) : (
            <>
              <div className="text-muted">
                {selectedItems ? selectedItems.length : "0"} selectionné
                {selectedItems?.length > 1 && "s"}
              </div>
              <div className="text-center">
                {`Voulez-vous vraiment supprimer les éléments selectionnés ?`}
              </div>
            </>
          )}
        </div>
      ),
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteItems(itemsids);
      },
    });
  };

  const fetchRoles = useCallback(async () => {
    try {
      const baseurl = `/roles?`
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
      setLoading(true);
      setRoles(data.rows);
      setTotalRecords(data.count);
    } catch (response) {
      console.log(response)

    } finally {
      setLoading(false);
    }
  }, [lazyState]);

  useEffect(() => {

    setBreadCrumbAction([roles_routes_items.roles])
    document.title = `BIU - ${roles_routes_items.roles.name}`

    return () => {
      setBreadCrumbAction([]);
    };
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [lazyState]);

  return (
    <>
      <ConfirmDialog closable dismissableMask={true} />

      {addVisible && <NewRoleModal visible={addVisible} setVisible={setAddVisible} data={inViewMenuItem} fetchRoles={fetchRoles} />}

      <div className="px-4 py-3 main_content">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="mb-3">Roles</h1>
          <Button
            label="Nouveau role"
            className="bitwi-button"
            icon="pi pi-plus"
            size="small"
            onClick={() => {
              setAddVisible(true);
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

          <div className="selection-actions d-flex align-items-center">
            <div className="text-muted mx-3">
              {selectedItems ? selectedItems.length : "0"} selectionné
              {selectedItems?.length > 1 && "s"}
            </div>
            <a
              href="#"
              className={`p-menuitem-link link-dark text-decoration-none ${(!selectedItems || selectedItems?.length == 0) &&
                "opacity-50 pointer-events-none"
                }`}
              style={{}}
              onClick={(e) =>
                handleDeletePress(
                  e,
                  selectedItems.map((item) => item.id)
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
                style={{ marginRight: "0.3rem" }}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              <span className="p-menuitem-text">Supprimer</span>
            </a>
          </div>
        </div>

        <div className="content">
          <div className="shadow rounded mt-3 pr-1 bg-white">
            <DataTable
              lazy
              value={roles}
              tableStyle={{ minWidth: "50rem" }}
              className=""
              paginator
              rowsPerPageOptions={[5, 10, 25, 50]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate={`Affichage de {first} à {last} dans ${totalRecords} éléments`}
              emptyMessage="Aucun role trouvé"
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
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              selectAll={selectAll}
              onSelectAllChange={onSelectAllChange}
              reorderableColumns
              resizableColumns
              columnResizeMode="expand"
              paginatorClassName="rounded"
              scrollable
            >
              <Column
                selectionMode="multiple"
                frozen
                headerStyle={{ width: "3rem" }}
              />
              <Column
                field="DESCRIPTION"
                header="Description"
                sortable
              />
               <Column
                field="IS_DELETED"
                frozen
                header="Supprimé?"
                body={(item) => {
                  return (
                    <InputSwitch checked={Boolean(item.IS_DELETED)} onChange={e => handleDeletePress(e, item)} />
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
                      items: [
                        {
                          label: 'Modifier',
                          icon: 'pi pi-pencil',
                          template: item => (
                            <div className='p-menuitem-content px-3'>
                              <Link onClick={e => setAddVisible(true)} className="flex align-items-center p-2" style={{ textDecoration: "none", color: '#3d3d3d' }}>
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
                              <a onClick={e => handleDeletePress(e, inViewMenuItem || selectedItems.map(e => e.ID_ROLE))} className="flex align-items-center p-2" style={{ textDecoration: "none", color: '#3d3d3d' }}>
                                <span className={`${item.icon} text-danger`} />
                                <span className="mx-2 text-danger">{item.label}</span>
                              </a>
                            </div>
                          )
                        }]
                    },
                  ];
                  return (
                    <>
                      <Menu model={items} onHide={() => setInViewMenuItem(null)} popup ref={menu} id="popup_menu_right" popupAlignment="right" />

                      <Button
                        rounded
                        severity="secondary"
                        text
                        aria-label="Menu"
                        size="small"
                        className="mx-1"
                        onClick={(event) => {
                          setInViewMenuItem(item);
                          menu.current.toggle(event);
                        }}
                      >
                        <span className="pi pi-ellipsis-h"></span>
                      </Button>
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
