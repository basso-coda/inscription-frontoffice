import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";

const ResumeConfirmation = ({ data, onBack, onSubmit }) => {

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setBreadCrumbAction, setToastAction } = useApp();
    const [facultes, setFacultes] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [nationalites, setNationalites] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [etatsCivils, setEtatsCivils] = useState([]);
    const { user } = useAuth();
    const [errors, setErrors] = useState(null);

    useEffect(() => {
    const fetchReferences = async () => {
        const [facs, deps, cls, nats, sexesRes, etats] = await Promise.all([
            fetchApi("/facultes"),
            fetchApi("/departements"),
            fetchApi("/classes"),
            fetchApi("/nationalites"),
            fetchApi("/sexes"),
            fetchApi("/etat_civils"),
        ]);

        setFacultes(facs.data.rows);
        setDepartements(deps.data.rows);
        setClasses(cls.data.rows);
        setNationalites(nats.data.rows);
        setSexes(sexesRes.data.rows);
        setEtatsCivils(etats.data.rows);
    };

    fetchReferences();
    }, []);

    const getNomFaculte = (id) => facultes.find(f => f.ID_FACULTE === id)?.DESCRIPTION || "N/A";
    const getNomDepartement = (id) => departements.find(d => d.ID_DEPARTEMENT === id)?.DESCRIPTION || "N/A";
    const getNomClasse = (id) => classes.find(c => c.ID_CLASSE === id)?.DESCRIPTION || "N/A";
    const getNationalite = (id) => nationalites.find(n => n.NATIONALITE_ID === id)?.NOM_NATIONALITE || "N/A";
    const getSexe = (id) => sexes.find(s => s.SEXE_ID === id)?.SEXE_DESCRIPTION || "N/A";
    const getEtatCivil = (id) => etatsCivils.find(e => e.ID_ETAT_CIVIL === id)?.DESCRIPTION || "N/A";

    const handleSubmit = async () => {
        
        try {
            setIsSubmitting(true)
            const formData = new FormData();

            // Ajouter les champs textuels
            for (const [key, value] of Object.entries(data)) {
                // Ne pas ajouter les documents et les personnes de contact ici
                if (key !== "DOCUMENTS" && key !== "PERSONNES_CONTACT") {
                    formData.append(key, value);
                }
            }

            // Ajouter les documents (avec le nom du champ document_TYPEID)
            // for (const [typeDocId, file] of Object.entries(data.DOCUMENTS || {})) {
            //     formData.append(`document_${typeDocId}`, file);
            // }

            Object.entries(data.DOCUMENTS).forEach(([typeId, file], index) => {
                formData.append(`documents[${index}][TYPE_DOCUMENT_ID]`, typeId);
                formData.append(`documents[${index}][IMAGE]`, file);
            });


            // Ajouter les personnes de contact (on les envoie comme JSON string)
            formData.append("PERSONNES_CONTACT", JSON.stringify(data.PERSONNES_CONTACT || []));

            formData.append("CANDIDAT_ID", user.data.ID_UTILISATEUR)

            // Envoi au backend
            const response = await fetchApi("/candidatures", {
                method: "POST",
                body: formData,
                headers: {
                    // Attention : pas besoin de 'Content-Type' ici (le navigateur le définit automatiquement)
                },
            });

            // if (res.success) {

                // ✅ Succès – rediriger ou afficher un message
            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            setErrors(null);
            navigate('/list-demande')

                // console.log("Candidature envoyée avec succès !");
            // } else {
            //     // ⚠️ Échec logique
            //     console.error("Erreur côté serveur", res);
            // }
        } catch (response) {
            // console.error("Erreur lors de l'envoi :", err);
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
            setIsSubmitting(false)
        }
    };

    const renderTable = (rows) => (
        <table className="table table-hover table-striped w-full">
            <tbody>
                {rows.map(({ label, value }, index) => (
                    <tr key={index}>
                        <th className="w-1/3">{label}</th>
                        <td className="capitalize">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );


    // return (
    //     <div className="flex flex-col gap-6 max-w-4xl mx-auto">
    //         <h2 className="text-2xl font-bold text-center text-blue-900 border-b pb-2">
    //             ✅ Résumé de la candidature
    //         </h2>

    //         {/* Choix académique */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">🎓 Choix académique</h3>
    //             <ul className="text-sm text-gray-700">
    //             <li><strong>Année académique :</strong> {data.ANNEE_ACADEMIQUE}</li>
    //             <li><strong>Faculté :</strong> {getNomFaculte(data.FACULTE_ID)}</li>
    //             <li><strong>Département :</strong> {getNomDepartement(data.DEPARTEMENT_ID)}</li>
    //             <li><strong>Classe :</strong> {getNomClasse(data.CLASSE_ID)}</li>
    //             </ul>
    //         </div>

    //         {/* Infos personnelles */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">👤 Informations personnelles</h3>
    //             <ul className="text-sm text-gray-700">
    //             <li><strong>Nom :</strong> {data.NOM}</li>
    //             <li><strong>Prénom :</strong> {data.PRENOM}</li>
    //             <li><strong>Email :</strong> {data.EMAIL_PRIVE}</li>
    //             <li><strong>Téléphone :</strong> {data.NUMERO_TELEPHONE_PRIVE}</li>
    //             <li><strong>Sexe :</strong> {getSexe(data.SEXE_ID)}</li>
    //             <li><strong>Etat civil :</strong> {getEtatCivil(data.ID_ETAT_CIVIL)} </li>
    //             <li><strong>Date de naissance :</strong> {data.DATE_NAISSANCE?.toLocaleDateString()}</li>
    //             <li><strong>Lieu de naissance :</strong> {data.LIEU_NAISSANCE}</li>
    //             <li><strong>Nationalité :</strong> {getNationalite(data.NATIONALITE_ID)}</li>
    //             <li><strong>N° Carte d'identité :</strong> {data.NUM_CARTE_IDENTITE}</li>
    //             <li><strong>Commune de délivrance :</strong> {data.COMMUNE_DELIVRANCE}</li>
    //             <li><strong>Adresse résidence :</strong> {data.ADRESSE_RESIDENCE} </li>
    //             </ul>
    //         </div>

    //         {/* Études antérieures */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">📚 Études antérieures</h3>
    //             <ul className="text-sm text-gray-700">
    //             <li><strong>École secondaire fréquentée :</strong> {data.NOM_DERNIERE_ECOLE_FREQUENTEE}</li>
    //             {/* <li><strong>Année d'obtention :</strong> {data.ANNEE_OBTENTION}</li> */}
    //             <li><strong>Note de l'école secondaire :</strong> {data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE} %</li>
    //             <li><strong>Note à l'examen d'État :</strong> {data.NOTE_EXAMEN_D_ETAT} %</li>
    //             </ul>
    //         </div>

    //         {/* Documents */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">📄 Documents fournis</h3>
    //             {data.DOCUMENTS && Object.keys(data.DOCUMENTS).length > 0 ? (
    //             <ul className="text-sm text-gray-700">
    //                 {Object.keys(data.DOCUMENTS).map((docId, index) => (
    //                 <li key={index}>✔️ Document #{docId}</li>
    //                 ))}
    //             </ul>
    //             ) : (
    //             <p className="text-sm text-red-600">Aucun document fourni</p>
    //             )}
    //         </div>

    //         {/* Personnes de contact */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">👥 Personnes de contact</h3>
    //             {data.PERSONNES_CONTACT?.length ? (
    //             <ul className="text-sm text-gray-700 space-y-1">
    //                 {data.PERSONNES_CONTACT.map((pers, i) => (
    //                 <li key={i}>
    //                     {pers.NOM} {pers.PRENOM} – {pers.LIEN_PARENTE}, {pers.NUMERO_TELEPHONE}
    //                 </li>
    //                 ))}
    //             </ul>
    //             ) : (
    //             <p className="text-sm text-red-600">Aucune personne de contact ajoutée</p>
    //             )}
    //         </div>

    //         {/* Termes acceptés */}
    //         <div>
    //             <h3 className="font-semibold text-lg text-gray-800 mb-2">📜 Termes acceptés</h3>
    //             <p className="text-sm">
    //             {data.TERMS_ACCEPTED ? "✅ Acceptés" : "❌ Non acceptés"}
    //             </p>
    //         </div>

    //         {/* Boutons */}
    //         <div className="flex justify-between mt-6">
    //             <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary rounded-button" />
    //             <Button
    //                 label="Soumettre ma candidature"
    //                 icon="pi pi-send"
    //                 iconPos="right"
    //                 // className="p-button-success"
    //                 className="bg-yellow-400 rounded-button"
    //                 onClick={handleSubmit}
    //             />
    //         </div>
    //     </div>
    // );


    // return (
    //     <div className="">

    //         <h2 className="text-2xl font-bold text-center text-blue-900 border-b pb-2">
    //             ✅ Résumé de la candidature
    //         </h2>
    //         <div className="">
    //             {/* Choix académique */}
    //             <Card title="🎓 Choix académique">
    //                 <ul className="text-sm text-gray-700 space-y-1">
    //                     <li><strong>Année académique :</strong> {data.ANNEE_ACADEMIQUE}</li>
    //                     <li><strong>Faculté :</strong> {getNomFaculte(data.FACULTE_ID)}</li>
    //                     <li><strong>Département :</strong> {getNomDepartement(data.DEPARTEMENT_ID)}</li>
    //                     <li><strong>Classe :</strong> {getNomClasse(data.CLASSE_ID)}</li>
    //                 </ul>
    //             </Card>

    //             {/* Infos personnelles */}
    //             <Card title="👤 Informations personnelles">
    //                 <ul className="text-sm text-gray-700 space-y-1">
    //                     <li><strong>Nom :</strong> {data.NOM}</li>
    //                     <li><strong>Prénom :</strong> {data.PRENOM}</li>
    //                     <li><strong>Email :</strong> {data.EMAIL_PRIVE}</li>
    //                     <li><strong>Téléphone :</strong> {data.NUMERO_TELEPHONE_PRIVE}</li>
    //                     <li><strong>Sexe :</strong> {getSexe(data.SEXE_ID)}</li>
    //                     <li><strong>État civil :</strong> {getEtatCivil(data.ID_ETAT_CIVIL)}</li>
    //                     <li><strong>Date de naissance :</strong> {data.DATE_NAISSANCE?.toLocaleDateString()}</li>
    //                     <li><strong>Lieu de naissance :</strong> {data.LIEU_NAISSANCE}</li>
    //                     <li><strong>Nationalité :</strong> {getNationalite(data.NATIONALITE_ID)}</li>
    //                     <li><strong>N° Carte d'identité :</strong> {data.NUM_CARTE_IDENTITE}</li>
    //                     <li><strong>Commune de délivrance :</strong> {data.COMMUNE_DELIVRANCE}</li>
    //                     <li><strong>Adresse résidence :</strong> {data.ADRESSE_RESIDENCE}</li>
    //                 </ul>
    //             </Card>

    //             {/* Études antérieures */}
    //             <Card title="📚 Études antérieures">
    //                 <ul className="text-sm text-gray-700 space-y-1">
    //                     <li><strong>École secondaire fréquentée :</strong> {data.NOM_DERNIERE_ECOLE_FREQUENTEE}</li>
    //                     <li><strong>Note de l'école secondaire :</strong> {data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE} %</li>
    //                     <li><strong>Note à l'examen d'État :</strong> {data.NOTE_EXAMEN_D_ETAT} %</li>
    //                 </ul>
    //             </Card>

    //             {/* Documents */}
    //             <Card title="📄 Documents fournis">
    //                 {data.DOCUMENTS && Object.keys(data.DOCUMENTS).length > 0 ? (
    //                     <ul className="text-sm text-gray-700 space-y-1">
    //                         {Object.keys(data.DOCUMENTS).map((docId, index) => (
    //                             <li key={index}>✔️ Document #{docId}</li>
    //                         ))}
    //                     </ul>
    //                 ) : (
    //                     <p className="text-sm text-red-600">Aucun document fourni</p>
    //                 )}
    //             </Card>

    //             {/* Personnes de contact */}
    //             <Card title="👥 Personnes de contact">
    //                 {data.PERSONNES_CONTACT?.length ? (
    //                     <ul className="text-sm text-gray-700 space-y-1">
    //                         {data.PERSONNES_CONTACT.map((pers, i) => (
    //                             <li key={i}>
    //                                 {pers.NOM} {pers.PRENOM} – {pers.LIEN_PARENTE}, {pers.NUMERO_TELEPHONE}
    //                             </li>
    //                         ))}
    //                     </ul>
    //                 ) : (
    //                     <p className="text-sm text-red-600">Aucune personne de contact ajoutée</p>
    //                 )}
    //             </Card>

    //             {/* Termes acceptés */}
    //             <Card title="📜 Termes acceptés">
    //                 <p className="text-sm">
    //                     {data.TERMS_ACCEPTED ? "✅ Acceptés" : "❌ Non acceptés"}
    //                 </p>
    //             </Card>

    //             {/* Boutons */}
    //             <Divider />
    //             <div className="flex justify-between pt-4">
    //                 <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary rounded-button" />
    //                 <Button
    //                     label="Soumettre ma candidature"
    //                     icon="pi pi-send"
    //                     iconPos="right"
    //                     className="bg-yellow-400 rounded-button text-white"
    //                     onClick={handleSubmit}
    //                 />
    //             </div>
    //         </div>
            
    //     </div>
    // );

    return (
        <div className="">
            <h2 className="text-2xl font-bold text-center text-blue-900 border-b pb-2">
                ✅ Résumé de la candidature
            </h2>

            <Card title="🎓 Choix académique">
                {renderTable([
                    { label: 'Année académique', value: data.ANNEE_ACADEMIQUE },
                    { label: 'Faculté', value: getNomFaculte(data.FACULTE_ID) },
                    { label: 'Département', value: getNomDepartement(data.DEPARTEMENT_ID) },
                    { label: 'Classe', value: getNomClasse(data.CLASSE_ID) },
                ])}
            </Card>

            <Card title="👤 Informations personnelles">
                {renderTable([
                    { label: 'Nom', value: data.NOM },
                    { label: 'Prénom', value: data.PRENOM },
                    { label: 'Email', value: data.EMAIL_PRIVE },
                    { label: 'Téléphone', value: data.NUMERO_TELEPHONE_PRIVE },
                    { label: 'Sexe', value: getSexe(data.SEXE_ID) },
                    { label: 'État civil', value: getEtatCivil(data.ETAT_CIVIL_ID) },
                    { label: 'Date de naissance', value: data.DATE_NAISSANCE?.toLocaleDateString() },
                    { label: 'Nationalité', value: getNationalite(data.NATIONALITE_ID) },
                    { label: "N° Carte d'identité", value: data.NUM_CARTE_IDENTITE },
                    { label: 'Commune de délivrance', value: data.COMMUNE_DELIVRANCE },
                    { label: 'Adresse résidence', value: data.ADRESSE_RESIDENCE },
                ])}
            </Card>

            <Card title="📚 Études antérieures">
                {renderTable([
                    { label: 'École secondaire fréquentée', value: data.NOM_DERNIERE_ECOLE_FREQUENTEE },
                    { label: "Note de l'école secondaire", value: `${data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE} %` },
                    { label: "Note à l'examen d'État", value: `${data.NOTE_EXAMEN_D_ETAT} %` },
                ])}
            </Card>

            <Card title="📄 Documents fournis">
                {data.DOCUMENTS && Object.keys(data.DOCUMENTS).length > 0 ? (
                    <table className="table table-hover table-striped w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(data.DOCUMENTS).map((docId, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>Document #{docId}</td>
                                    <td>
                                        <Button
                                            label="Voir"
                                            icon="pi pi-eye"
                                            className="p-button-text p-button-sm"
                                            onClick={() =>
                                                {
                                                    const file = data.DOCUMENTS[docId];
                                                    if (file instanceof File) {
                                                        const fileUrl = URL.createObjectURL(file);
                                                        window.open(fileUrl, '_blank');
                                                    } else {
                                                        console.warn("Pas de fichier disponible pour l'aperçu")
                                                    }
                                                }
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-red-600">Aucun document fourni</p>
                )}
            </Card>

            <Card title="👥 Personnes de contact">
                {data.PERSONNES_CONTACT?.length ? (
                    <table className="table table-hover table-striped w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Parente</th>
                                <th>Téléphone</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.PERSONNES_CONTACT.map((pers, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{pers.NOM}</td>
                                    <td>{pers.PRENOM}</td>
                                    <td>{pers.LIEN_PARENTE}</td>
                                    <td>{pers.NUMERO_TELEPHONE}</td>
                                    <td>{pers.EMAIL || <i style={{ color: 'gray' }}>Non renseigné</i>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-sm text-red-600">Aucune personne de contact ajoutée</p>
                )}
            </Card>


            <Card title="📜 Termes acceptés">
                <p className="text-sm">
                    {data.TERMS_ACCEPTED ? "✅ Acceptés" : "❌ Non acceptés"}
                </p>
            </Card>

            <Divider />
            <div className="flex justify-between pt-4">
                <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary rounded-button" />
                <Button
                    label="Soumettre ma candidature"
                    icon={isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-send`}
                    iconPos="right"
                    className="bg-yellow-400 rounded-button text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
};

export default ResumeConfirmation;
