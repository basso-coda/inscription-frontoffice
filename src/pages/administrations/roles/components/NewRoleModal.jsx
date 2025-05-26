
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import { useNavigate, useParams } from "react-router-dom";
import fetchApi from "@/helpers/fetchApi";
import { useApp } from "@/hooks/useApp";
import AffectationProfileRole from "./AffectationProfileRole";

const NewRoleModal = (props) => {

    const { setToastAction } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        ID_ROLE: props.data?.ID_ROLE,
        DESCRIPTION: "",
    };

    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState(null);
    const [profils, setProfils] = useState([]);
    const [selectedProfils, setSelectedProfils] = useState([]);

    const fetchRole = async () => {
        try {
            const response = await fetchApi(`/roles/${props.data.ID_ROLE}`);
            setData(response.data)
        } catch (error) {
            console.log(error);

        }
    }

    const fetchAllRoles = async () => {
        try {
            const response = await fetchApi('/profils');
            setProfils(response.data.rows)

        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setIsSubmitting(true);

            const url = `/roles${data?.ID_ROLE ? `/${data.ID_ROLE}` : ''}`

            const response = await fetchApi(url, {
                method: data?.ID_ROLE ? 'PUT' : 'POST',
                body: JSON.stringify({
                    // ROLE_NOM: data.ROLE_NOM,
                    DESCRIPTION: data.DESCRIPTION,
                    PROFILS: selectedProfils.map(p => {
                        delete p.ROLES;
                        return p;
                    }),
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            navigate('/roles');

            setErrors(null);

            props.setVisible(false);
            props.fetchRoles();

        } catch (response) {
            if (response.httpStatus === 422) {
                setErrors(response.errors);
            }

            setToastAction({
                severity: "error",
                summary: "Erreur",
                detail: response.message,
                life: 3000,
            })
        } finally {
            setIsSubmitting(false);

        }
    };

    useEffect(() => {
        if (props.data) {
            fetchRole();
        }

        fetchAllRoles()

    }, []);

    return (
        <Dialog
            header={data?.ID_ROLE ? `Modifier le role` : `Nouveau role`}
            visible={props.visible}
            position="center"
            style={{ width: "50vw" }}
            onHide={() => {
                props.setVisible(!props.visible);
            }}
        >
            <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                <div className="row">
                    <TabView>
                        <TabPanel
                            header={`Détail de rôle`}
                            rightIcon="pi pi-align-left ml-2"
                        >
                            {/* <div className="col-md-12">
                                <label htmlFor="price" className="label mb-1">
                                    Nom
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <InputText
                                    disabled
                                    type="text"
                                    id="ROLE_NOM"
                                    name="ROLE_NOM"
                                    style={{ borderRadius: "0px" }}
                                    value={data.ROLE_NOM}
                                    placeholder=""
                                    className={`w-100 is-invalid ${errors?.ROLE_NOM ? "p-invalid" : ""
                                        }`}
                                    onChange={(e) => setData(d => ({ ...data, "ROLE_NOM": e.target.value }))}
                                />
                                <div
                                    className="invalid-feedback"
                                    style={{ minHeight: 10, display: "block" }}
                                >
                                    {errors?.ROLE_NOM ? errors?.ROLE_NOM : ""}
                                </div>
                            </div> */}

                            <div className="col-md-12">
                                <label htmlFor="DESCRIPTION" className="label mb-1">
                                    Description
                                </label>
                                <InputText
                                    type="text"
                                    id="DESCRIPTION"
                                    name="DESCRIPTION"
                                    style={{ borderRadius: "0px" }}
                                    value={data.DESCRIPTION}
                                    placeholder=""
                                    className={`w-100 is-invalid ${errors?.DESCRIPTION
                                        ? "p-invalid"
                                        : ""
                                        }`}
                                    onChange={(e) => setData(d => ({ ...data, DESCRIPTION: e.target.value }))}
                                />
                                <div
                                    className="invalid-feedback"
                                    style={{ minHeight: 10, display: "block" }}
                                >
                                </div>
                            </div>
                        </TabPanel>

                        <TabPanel
                            header={`Affectation`}
                            rightIcon="pi pi-check-circle ml-2"
                        >
                            <AffectationProfileRole roleID={data?.ID_ROLE} profils={profils} setSelectedProfils={setSelectedProfils} />
                        </TabPanel>
                    </TabView>
                </div>

                <div className="w-100 d-flex justify-content-end  pb-1 bg-white">

                    <Button
                        label={'Enregistrer'}
                        type="submit"
                        icon={isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-save`}
                        className="bitwi-button"
                        size="small"
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Dialog>
        // </div>
    );
};

export default NewRoleModal;