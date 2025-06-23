import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { useAuth } from "@/hooks/useAuth";

const ResumeConfirmation = ({ data, onBack, onSubmit }) => {

    const [facultes, setFacultes] = useState([]);
    const [departements, setDepartements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [nationalites, setNationalites] = useState([]);
    const [sexes, setSexes] = useState([]);
    const [etatsCivils, setEtatsCivils] = useState([]);
    const { user } = useAuth();

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
            const res = await fetchApi("/candidatures", {
                method: "POST",
                body: formData,
                headers: {
                    // Attention : pas besoin de 'Content-Type' ici (le navigateur le définit automatiquement)
                },
            });

            if (res.success) {
                // ✅ Succès – rediriger ou afficher un message
                console.log("Candidature envoyée avec succès !");
            } else {
                // ⚠️ Échec logique
                console.error("Erreur côté serveur", res);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi :", err);
        }
    };


    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-blue-900 border-b pb-2">
                ✅ Résumé de la candidature
            </h2>

            {/* Choix académique */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">🎓 Choix académique</h3>
                <ul className="text-sm text-gray-700">
                <li><strong>Année académique :</strong> {data.ANNEE_ACADEMIQUE}</li>
                <li><strong>Faculté :</strong> {getNomFaculte(data.FACULTE_ID)}</li>
                <li><strong>Département :</strong> {getNomDepartement(data.DEPARTEMENT_ID)}</li>
                <li><strong>Classe :</strong> {getNomClasse(data.CLASSE_ID)}</li>
                </ul>
            </div>

            {/* Infos personnelles */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">👤 Informations personnelles</h3>
                <ul className="text-sm text-gray-700">
                <li><strong>Nom :</strong> {data.NOM}</li>
                <li><strong>Prénom :</strong> {data.PRENOM}</li>
                <li><strong>Email :</strong> {data.EMAIL_PRIVE}</li>
                <li><strong>Téléphone :</strong> {data.NUMERO_TELEPHONE_PRIVE}</li>
                <li><strong>Sexe :</strong> {getSexe(data.SEXE_ID)}</li>
                <li><strong>Etat civil :</strong> {getEtatCivil(data.ID_ETAT_CIVIL)} </li>
                <li><strong>Date de naissance :</strong> {data.DATE_NAISSANCE?.toLocaleDateString()}</li>
                <li><strong>Lieu de naissance :</strong> {data.LIEU_NAISSANCE}</li>
                <li><strong>Nationalité :</strong> {getNationalite(data.NATIONALITE_ID)}</li>
                <li><strong>N° Carte d'identité :</strong> {data.NUM_CARTE_IDENTITE}</li>
                <li><strong>Commune de délivrance :</strong> {data.COMMUNE_DELIVRANCE}</li>
                <li><strong>Adresse résidence :</strong> {data.ADRESSE_RESIDENCE} </li>
                </ul>
            </div>

            {/* Études antérieures */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">📚 Études antérieures</h3>
                <ul className="text-sm text-gray-700">
                <li><strong>École secondaire fréquentée :</strong> {data.NOM_DERNIERE_ECOLE_FREQUENTEE}</li>
                {/* <li><strong>Année d'obtention :</strong> {data.ANNEE_OBTENTION}</li> */}
                <li><strong>Note de l'école secondaire :</strong> {data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE} %</li>
                <li><strong>Note à l'examen d'État :</strong> {data.NOTE_EXAMEN_D_ETAT} %</li>
                </ul>
            </div>

            {/* Documents */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">📄 Documents fournis</h3>
                {data.DOCUMENTS && Object.keys(data.DOCUMENTS).length > 0 ? (
                <ul className="text-sm text-gray-700">
                    {Object.keys(data.DOCUMENTS).map((docId, index) => (
                    <li key={index}>✔️ Document #{docId}</li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-red-600">Aucun document fourni</p>
                )}
            </div>

            {/* Personnes de contact */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">👥 Personnes de contact</h3>
                {data.PERSONNES_CONTACT?.length ? (
                <ul className="text-sm text-gray-700 space-y-1">
                    {data.PERSONNES_CONTACT.map((pers, i) => (
                    <li key={i}>
                        {pers.NOM} {pers.PRENOM} – {pers.LIEN_PARENTE}, {pers.NUMERO_TELEPHONE}
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-sm text-red-600">Aucune personne de contact ajoutée</p>
                )}
            </div>

            {/* Termes acceptés */}
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">📜 Termes acceptés</h3>
                <p className="text-sm">
                {data.TERMS_ACCEPTED ? "✅ Acceptés" : "❌ Non acceptés"}
                </p>
            </div>

            {/* Boutons */}
            <div className="flex justify-between mt-6">
                <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary" />
                <Button
                    label="Soumettre ma candidature"
                    icon="pi pi-send"
                    iconPos="right"
                    className="p-button-success"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};

export default ResumeConfirmation;
