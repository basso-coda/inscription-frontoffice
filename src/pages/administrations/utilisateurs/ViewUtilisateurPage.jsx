import fetchApi from "@/helpers/fetchApi";
import { useEffect, useState } from "react";
import { utilisateurs_routes_items } from "@/routes/administrations/utilisateurs_routes";
import { useApp } from "@/hooks/useApp";
import { useLocation, useParams } from "react-router-dom";
import { Panel } from "primereact/panel";
import { Image } from "primereact/image";
import { Avatar } from "primereact/avatar";
import { formatDate } from "@/helpers/formatter";

export default function ViewUtilisateurPage() {
    const [loading, setLoading] = useState(false);
    const { setBreadCrumbAction } = useApp()
    const { state } = useLocation()
    const params = state?.ID_utilisateur ? state : useParams();

    const initialValues = {
        NOM: "",
        PRENOM: "",
        USERNAME: "",
        EMAIL: "",
        TELEPHONE: "",
        DATE_INSERTION: null,

        SEXE_ID: null,
        PROFIL_ID: null,

        IMAGE: null,
    }

    const [data, setData] = useState(initialValues)

    const fetchCurrentUtilisateur = async () => {
        try {
            setLoading(true)
            const res = await fetchApi(`/utilisateurs/${params.ID_utilisateur}`);
            setData(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
console.log(data)
    useEffect(() => {
        document.title = utilisateurs_routes_items.voir_utilisateur.name;

        setBreadCrumbAction(state ? [{
            path: "auth/view-profil",
            name: "Voir le profil",
            component: ViewUtilisateurPage,
        }] : [utilisateurs_routes_items.utilisateurs, utilisateurs_routes_items.voir_utilisateur])

        fetchCurrentUtilisateur();

        return () => {
            setBreadCrumbAction([]);
        };

    }, [state])

    return (
        <>
            <div className="px-4 py-3 main_content bg-white">
                <div className="w-full flex gap-6">
                    <Panel header="Profil">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                {data?.IMAGE ? <Image
                                    src={`${data?.IMAGE}`}
                                    alt="Image"
                                    className="rounded-5"
                                    imageClassName="rounded-5 object-fit-cover"
                                    imageStyle={{ width: "128px", height: "128px" }}
                                    preview
                                />

                                    : <Avatar icon="pi pi-user" size="xlarge" style={{ width: "128px", height: "128px" }} />
                                }
                            </div>
                        </div>
                    </Panel>

                    <Panel header="Identification">
                        <div className="grid gap-6 flex-wrap">
                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div>
                                    <div className="label mb-1">Nom</div>
                                </div>
                                <div className="font-bold">{data.NOM}</div>
                            </div>

                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div className="label mb-1">Prénom</div>
                                <div className="font-bold">{data.PRENOM}</div>
                            </div>

                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div className="label mb-1">Nom d'utilisateur</div>
                                <div className="font-bold">{data.USERNAME}</div>
                            </div>

                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div className="label mb-1">Email</div>
                                <div className="font-bold">
                                    {data?.EMAIL}
                                </div>
                            </div>

                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div className="label mb-1">Numéro téléphone</div>
                                <div className="font-bold">
                                    {data?.TELEPHONE}
                                </div>
                            </div>
                            
                            <div style={{ flex: '1 1 0' }} className="col-4">
                                <div className="label mb-1">Sexe</div>
                                <div className="font-bold">
                                    {data?.sexe?.SEXE_DESCRIPTION}
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* <Panel header="Documents" className="mt-4">
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            {data?.IMAGE ? <Image
                                src={`${data?.IMAGE}`}
                                alt="Image"
                                className="rounded-5"
                                imageClassName="rounded-5 object-fit-cover"
                                imageStyle={{ width: "128px", height: "128px" }}
                                preview
                            />

                                : <Avatar icon="pi pi-user" size="xlarge" style={{ width: "128px", height: "128px" }} />
                            }
                        </div>
                    </div>
                </Panel> */}
            </div>
        </>
    )
}