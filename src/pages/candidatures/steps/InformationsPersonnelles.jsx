import React, { useCallback, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { useAuth } from "@/hooks/useAuth";

const InformationsPersonnelles = ({ data, updateFormData, onNext, onBack }) => {
    const [sexes, setSexes] = useState([]);
    const [nationalites, setNationalites] = useState([]);
    const [etatsCivils, setEtatsCivils] = useState([]);
    const { user } = useAuth();
// console.log(user);

    useEffect(() => {
        if (user?.data) {
            updateFormData({
                NOM: user.data.NOM,
                PRENOM: user.data.PRENOM,
                EMAIL_PRIVE: user.data.EMAIL,
                NUMERO_TELEPHONE_PRIVE: user.data.TELEPHONE,
                SEXE_ID: user.data.SEXE_ID,
            })
        }
        const fetchData = async () => {
        const resSexes = await fetchApi('/sexes');
        const resNationalites = await fetchApi('/nationalites');
        const resEtats = await fetchApi('/etat_civils');

        setSexes(
            resSexes.data.rows.map((s) => ({ name: s.SEXE_DESCRIPTION, code: s.SEXE_ID }))
        );
        setNationalites(
            resNationalites.data.rows.map((n) => ({ name: n.NOM_NATIONALITE, code: n.NATIONALITE_ID }))
        );
        setEtatsCivils(
            resEtats.data.rows.map((e) => ({ name: e.DESCRIPTION, code: e.ID_ETAT_CIVIL }))
        );
        };

        fetchData();
    }, []);

    const sexeOptions = [
        { label: "Féminin", value: 1 },
        { label: "Masculin", value: 2 },
    ];

    const handleChange = (field, value) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="grid gap-4">
            <h2 className="text-xl font-semibold mb-1">Informations personnelles</h2>
            <p className="text-gray-500 mb-4">
                N.B: Si vous êtes étranger, indiquez le numéro de votre passeport pour "numéro carte d'identité" et indiquez la ville ou le lieu où votre pièce d'identité a été délivrée pour "commune delivrance".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <span className="p-float-label">
                <InputText
                    id="nom"
                    value={data.NOM || ""}
                    readOnly
                    className="w-full"
                />
                <label htmlFor="nom">Nom</label>
                </span>

                <span className="p-float-label">
                <InputText
                    id="prenom"
                    value={data.PRENOM || ""}
                    readOnly
                    className="w-full"
                />
                <label htmlFor="prenom">Prénom</label>
                </span>

                <span className="p-float-label">
                <Calendar
                    id="dateNaissance"
                    value={data.DATE_NAISSANCE}
                    onChange={(e) => handleChange("DATE_NAISSANCE", e.value)}
                    dateFormat="dd/mm/yy"
                    className="w-full"
                    showIcon
                    maxDate={new Date()} // Limite à aujourd'hui
                />
                <label htmlFor="dateNaissance">Date de naissance</label>
                </span>

                <span className="p-float-label">
                <Dropdown
                    id="sexe"
                    value={data.SEXE_ID || null}
                    options={sexeOptions}
                    optionLabel="label"
                    optionValue="value"
                    className="w-full"
                    disabled
                />
                <label htmlFor="sexe">Sexe</label>
                </span>

                <span className="p-float-label">
                <Dropdown
                    id="etatCivil"
                    value={data.ETAT_CIVIL_ID}
                    options={etatsCivils}
                    onChange={(e) => handleChange("ETAT_CIVIL_ID", e.value)}
                    optionLabel="name"
                    optionValue="code"
                    className="w-full"
                    placeholder="Sélectionnez"
                />
                <label htmlFor="etatCivil">État civil</label>
                </span>

                <span className="p-float-label">
                <Dropdown
                    id="nationalite"
                    value={data.NATIONALITE_ID}
                    options={nationalites}
                    onChange={(e) => handleChange("NATIONALITE_ID", e.value)}
                    optionLabel="name"
                    optionValue="code"
                    className="w-full"
                    placeholder="Sélectionnez"
                />
                <label htmlFor="nationalite">Nationalité</label>
                </span>

                <span className="p-float-label">
                <InputText
                    id="numCni"
                    value={data.NUM_CARTE_IDENTITE}
                    onChange={(e) => handleChange("NUM_CARTE_IDENTITE", e.target.value)}
                    className="w-full"
                />
                <label htmlFor="numCni">Numéro carte d'identité</label>
                </span>

                <span className="p-float-label">
                <InputText
                    id="commune"
                    value={data.COMMUNE_DELIVRANCE}
                    onChange={(e) => handleChange("COMMUNE_DELIVRANCE", e.target.value)}
                    className="w-full"
                />
                <label htmlFor="commune">Commune de délivrance</label>
                </span>

                <span className="p-float-label">
                <Calendar
                    id="dateDelivrance"
                    value={data.DATE_DELIVRANCE}
                    onChange={(e) => handleChange("DATE_DELIVRANCE", e.value)}
                    dateFormat="dd/mm/yy"
                    className="w-full"
                    showIcon
                    maxDate={new Date()} // Limite à aujourd'hui
                />
                <label htmlFor="dateDelivrance">Date de délivrance</label>
                </span>

                <span className="p-float-label">
                <InputText
                    id="email"
                    value={data.EMAIL_PRIVE || ""}
                    readOnly
                    className="w-full"
                />
                <label htmlFor="email">Email privé</label>
                </span>

                <span className="p-float-label">
                <InputText
                    id="telephone"
                    value={data.NUMERO_TELEPHONE_PRIVE || ""}
                    readOnly
                    className="w-full"
                />
                <label htmlFor="telephone">Téléphone privé</label>
                </span>

                <span className="p-float-label col-span-1 md:col-span-2">
                <InputText
                    id="adresse"
                    value={data.ADRESSE_RESIDENCE}
                    onChange={(e) => handleChange("ADRESSE_RESIDENCE", e.target.value)}
                    className="w-full"
                />
                <label htmlFor="adresse">Adresse de résidence</label>
                </span>
            </div>
            
            <div className="flex justify-between mt-4">
                <Button
                label="Retour"
                icon="pi pi-arrow-left"
                onClick={onBack}
                className="p-button-secondary"
                />
                <Button
                label="Suivant"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={onNext}
                disabled={!data.ETAT_CIVIL_ID || !data.NATIONALITE_ID || !data.NUM_CARTE_IDENTITE || !data.ADRESSE_RESIDENCE || !data.DATE_NAISSANCE || !data.DATE_DELIVRANCE || !data.COMMUNE_DELIVRANCE}
                />
            </div>
        </div>
    );
};

export default InformationsPersonnelles;
