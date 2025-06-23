// const ViewDemande = () => {
//     const { user } = useAuth();
//     const [loading, setLoading] = useState(true);
//     const initialValues = {
//         ANNEE_ACADEMIQUE: "",
//         CLASSE_ID: "",
//         NOM: "",
//         PRENOM: "",
//         DATE_NAISSANCE: "",
//         NATIONALITE_ID: "",
//         NUM_CARTE_IDENTITE: "",
//         COMMUNE_DELIVRANCE: "",
//         DATE_DELIVRANCE: "",
//         SEXE_ID: "",
//         ETAT_CIVIL_ID: "",
//         EMAIL_PRIVE: "",
//         NUMERO_TELEPHONE_PRIVE: "",
//         ADRESSE_RESIDENCE: "",
//         NOM_DERNIERE_ECOLE_FREQUENTEE: "",
//         NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE: "",
//         NOTE_EXAMEN_D_ETAT: "",
//         STATUT_CANDIDATURE: "",
//         SECRETAIRE_ID: "",
//         // DOCUMENTS: {},
//         // PERSONNES_CONTACT: [],
//         // TERMS_ACCEPTED: false,
//     }

//     const [candidature, setCandidature] = useState(initialValues);

//     useEffect(() => {
//         const fetchCandidature = async () => {
//         try {
//             const res = await fetchApi(`/mes-demandes/${user.data.ID_UTILISATEUR}`);
//             setCandidature(res.data);
//         } catch (error) {
//             console.error("Erreur lors du chargement de la candidature", error);
//         } finally {
//             setLoading(false);
//         }
//         };

//         fetchCandidature();
//     }, []);

//     if (loading) {
//         return (
//         <div className="flex justify-content-center mt-6">
//             <ProgressSpinner />
//         </div>
//         );
//     }

//     if (!candidature) {
//         return (
//         <div className="text-center text-red-600 mt-4">
//             Aucune candidature trouvée.
//         </div>
//         );
//     }
// console.log(candidature);

//     return (
//         <div className="container p-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
//         <Card title="Mon Dossier de Candidature">
//             <p><strong>Nom :</strong> {candidature.NOM} {candidature.PRENOM}</p>
//             <p><strong>Date de naissance :</strong> {new Date(candidature.DATE_NAISSANCE).toLocaleDateString()}</p>
//             <p><strong>Classe :</strong> {candidature.classe?.DESCRIPTION}</p>
//             <p><strong>Email :</strong> {candidature.EMAIL_PRIVE}</p>
//             <p><strong>Téléphone :</strong> {candidature.NUMERO_TELEPHONE_PRIVE}</p>
//             <p><strong>Nationalité :</strong> {candidature.nationalite?.LIBELLE}</p>
//             <p><strong>Sexe :</strong> {candidature.sexe?.LIBELLE}</p>
//             <p><strong>État civil :</strong> {candidature.etat_civil?.LIBELLE}</p>

//             <p><strong>Statut :</strong> 
//             <Tag value={getStatutText(candidature.STATUT_CANDIDATURE)} severity="info" className="ml-2" />
//             </p>

//             <Divider />
//             <h4 className="mb-2">📄 Documents Fournis</h4>
//             {candidature.documents?.length > 0 ? (
//             <ul className="list-disc ml-4">
//                 {candidature.documents.map((doc) => (
//                 <li key={doc.ID_DOCUMENT}>
//                     {doc.type_document?.NOM_TYPE_DOCUMENT} :
//                     <a
//                     href={`/uploads/${doc.PATH_DOCUMENT}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="ml-2 text-blue-600 underline"
//                     >
//                     Voir document
//                     </a>
//                 </li>
//                 ))}
//             </ul>
//             ) : (
//             <p>Aucun document fourni.</p>
//             )}

//             <Divider />
//             <h4 className="mb-2">👥 Personnes de contact</h4>
//             {candidature.personnes_contact?.length > 0 ? (
//             <ul className="list-disc ml-4">
//                 {candidature.personnes_contact.map((personne) => (
//                 <li key={personne.ID_PERSONNE_CONTACT}>
//                     {personne.NOM} - {personne.LIEN_PARENTE} - {personne.TELEPHONE}
//                 </li>
//                 ))}
//             </ul>
//             ) : (
//             <p>Aucune personne de contact.</p>
//             )}
//         </Card>
//         </div>
//     );
// };

import fetchApi from "@/helpers/fetchApi";
import { useEffect, useState } from "react";
import { useApp } from "@/hooks/useApp";
import {  useLocation, useParams } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { TabPanel, TabView } from "primereact/tabview";
import { Skeleton } from "primereact/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Tag } from "primereact/tag";
import { demande_inscription_routes_items } from "@/routes/candidatures/demande_inscription_routes";
import { Badge } from "primereact/badge";
import ChoixAcademiqueDetails from "./details/ChoixAcademiqueDetails";
import InformationsPersonnellesDetails from "./details/InformationsPersonnellesDetails";
import EtudesAnterieuresDetails from "./details/EtudesAnterieuresDetails";
import DocumentsExigesDetails from "./details/DocumentsExigesDetails";
import PersonnesContactDetails from "./details/PersonnesContactDetails";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// import PartenaireDocumentDetail from "./detail/PartenaireDocumentDetail";

export default function ViewDemande() {
    const [loading, setLoading] = useState(true);
    const { setBreadCrumbAction } = useApp()
    const { state } = useLocation()
    const params = state?.ID_CANDIDATURE ? state : useParams();
    const [showMotif, setShowMotif] = useState(false)
    

    const getStatutText = (statut) => {
        switch (statut) {
            case 1: return 'Demande reçue';
            case 2: return 'En cours de traitement';
            case 3: return 'Acceptée';
            case 4: return 'Rejetée';
            default: return 'Inconnu';
        }
    };

    const initialValues = {
        ANNEE_ACADEMIQUE: "",
        CLASSE_ID: "",
        NOM: "",
        PRENOM: "",
        DATE_NAISSANCE: "",
        NATIONALITE_ID: "",
        NUM_CARTE_IDENTITE: "",
        COMMUNE_DELIVRANCE: "",
        DATE_DELIVRANCE: "",
        SEXE_ID: "",
        ETAT_CIVIL_ID: "",
        EMAIL_PRIVE: "",
        NUMERO_TELEPHONE_PRIVE: "",
        ADRESSE_RESIDENCE: "",
        NOM_DERNIERE_ECOLE_FREQUENTEE: "",
        NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE: "",
        NOTE_EXAMEN_D_ETAT: "",
        STATUT_CANDIDATURE: "",
        SECRETAIRE_ID: "",
        // DOCUMENTS: {},
        // PERSONNES_CONTACT: [],
    }

    const [data, setData] = useState(initialValues)

    const fetchMesDemandes = async () => {
        try {
            setLoading(true)
            const res = await fetchApi(`/candidatures/${params.ID_CANDIDATURE}`);
            setData(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        document.title = demande_inscription_routes_items.view_demande.name;

        setBreadCrumbAction(state ? [{
            path: "view-demande",
            name: "Voir mon Dossier",
            component: ViewDemande,
        }] : [demande_inscription_routes_items.list_demande, demande_inscription_routes_items.view_demande])

        fetchMesDemandes();

        return () => {
            setBreadCrumbAction([]);
        };

    }, [state])
    

    return (
        <>
            <Dialog
                header="Motifs du rejet"
                visible={showMotif}
                style={{ width: '40vw' }}
                onHide={() => setShowMotif(false)}
            >
                <p>
                    {data?.motif_rejets?.length > 0 ? (
                        <ul>
                            {data.motif_rejets.map((item, index) => (
                                <li key={index}>
                                    {item.motif?.DESCRIPTION || "Motif non trouvé."}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun motif enregistré.</p>
                    )}
                </p>
            </Dialog>

            <div className="container py-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {loading ? <div
                    className="shadows p-4 "
                    style={{ border: "solid 1px white" }}
                >
                    <div className="flex mb-3">
                        <Skeleton
                            shape="circle"
                            size="4rem"
                            className="mr-2"
                        ></Skeleton>
                        <div>
                            <Skeleton width="10rem" className="mb-2"></Skeleton>
                            <Skeleton width="5rem" className="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="100px"></Skeleton>
                </div> : <>
                    <center>
                        <h4>
                            <span className="mx-2 mb-2">
                                {data.STATUT_CANDIDATURE=='1'?(<Badge value="Demande reçue" severity="secondary"></Badge>):null} 
                                {data.STATUT_CANDIDATURE=='2'?(<Badge value="Demande en cours de traitement" severity="info"></Badge>):null} 
                                {data.STATUT_CANDIDATURE=='3'?(<Badge value="Demande en attente de paiement. Veuillez procéder au paiement svp!" severity="warning"></Badge>):null}
                                {data.STATUT_CANDIDATURE=='4'?(<Badge value="Demande approuvée" severity="success"></Badge>):null}
                                {data.STATUT_CANDIDATURE=='5'?(<Badge value="Demande refusée" severity="danger"></Badge>):null} 
                            </span>
                        </h4>
                    </center>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card" style={{ borderRadius: "0px" }}>
                                <TabView>
                                    <TabPanel
                                        header={`Choix académique`}
                                        rightIcon="pi pi-align-left ml-2 mr-2"
                                    >
                                        <ChoixAcademiqueDetails data={data} />

                                    </TabPanel>
                                    <TabPanel
                                        header={`Informations personnelles`}
                                        rightIcon="pi pi-align-left ml-2 mr-2"
                                    >
                                        <InformationsPersonnellesDetails data={data} />

                                    </TabPanel>
                                    <TabPanel
                                        header={`Etudes antérieures`}
                                        rightIcon="pi pi-align-left ml-2 mr-2"
                                    >
                                        <EtudesAnterieuresDetails data={data} />

                                    </TabPanel>
                                    <TabPanel
                                        header={`Documents`}
                                        rightIcon="pi pi-file ml-2"
                                    >
                                        <DocumentsExigesDetails documents={data?.documents || []} />

                                    </TabPanel>
                                    <TabPanel
                                        header={`Personnes de contact`}
                                        rightIcon="pi pi-align-left ml-2 mr-2"
                                    >
                                        <PersonnesContactDetails personnes={data?.personnes_contact || []} />

                                    </TabPanel>
                                </TabView>
                            </div>

                            <div className="flex justify-between mt-4">
                                {data.STATUT_CANDIDATURE === 5 && (
                                    <>
                                        <Message severity="error" text="Cette demande a été refusée." />
                                        <Button label="Voir les motifs du refus" icon="pi pi-eye" onClick={() => setShowMotif(true)} className="p-button-warning mt-2" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
                }
            </div>
        </>
    )
}

// export default ViewDemande;
