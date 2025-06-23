import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useApp } from "@/hooks/useApp";

const liens = [
  { label: "Père", value: "Père" },
  { label: "Mère", value: "Mère" },
  { label: "Frère/Sœur", value: "Frère/Sœur" },
  { label: "Tuteur", value: "Tuteur" },
  { label: "Autre", value: "Autre" },
];

const PersonnesContact = ({ data, updateFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const { setToastAction } = useApp();
  
  const personnes = data.PERSONNES_CONTACT || [];

  const validate = () => {
    const newErrors = {};
    personnes.forEach((p, i) => {
      const e = {};
      if (!p.NOM) e.NOM = "Nom requis";
      if (!p.PRENOM) e.PRENOM = "Prénom requis";
      if (!p.LIEN_PARENTE) e.LIEN_PARENTE = "Lien requis";
      if (!p.NUMERO_TELEPHONE) e.NUMERO_TELEPHONE = "Téléphone requis";
      if (Object.keys(e).length) newErrors[i] = e;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (index, field, value) => {
    const updated = [...personnes];
    updated[index][field] = value;
    updateFormData({ PERSONNES_CONTACT: updated });
    setErrors((prev) => {
      const newErr = { ...prev };
      if (newErr[index]) {
        delete newErr[index][field];
        if (Object.keys(newErr[index]).length === 0) delete newErr[index];
      }
      return newErr;
    });
  };

  const ajouterPersonne = () => {
    // Si aucune personne n'a encore été ajoutée, on autorise l'ajout
    if (personnes.length === 0) {
      const nouvellePersonne = {
        NOM: '',
        PRENOM: '',
        EMAIL: '',
        NUMERO_TELEPHONE: '',
        ADRESSE_RESIDENCE: '',
        LIEN_PARENTE: '',
      };
      updateFormData({ PERSONNES_CONTACT: [nouvellePersonne] });
      return;
    }

    // Sinon, on vérifie que la derniere est bien remplie avant d'ajouter une autre
    const lastPersonne = personnes[personnes.length - 1];

    const isIncomplete = !lastPersonne?.NOM || !lastPersonne?.PRENOM ||
                        !lastPersonne?.NUMERO_TELEPHONE || !lastPersonne?.ADRESSE_RESIDENCE || !lastPersonne?.LIEN_PARENTE;

    if (isIncomplete) {
      setToastAction({
        severity: 'warn',
        summary: 'Champs requis',
        detail: 'Veuillez remplir tous les champs avant d\'ajouter une autre personne.',
        life: 3000,
      });
      return;
    }

    const nouvellePersonne = {
      NOM: '',
      PRENOM: '',
      EMAIL: '',
      NUMERO_TELEPHONE: '',
      ADRESSE_RESIDENCE: '',
      LIEN_PARENTE: '',
    };
    const updatedList = [...personnes, nouvellePersonne];
    updateFormData({ PERSONNES_CONTACT : updatedList });
  };

  const supprimerPersonne = (index) => {
    const updated = [...personnes];
    updated.splice(index, 1);
    updateFormData({ PERSONNES_CONTACT: updated });

    const newErr = { ...errors };
    delete newErr[index];
    setErrors(newErr);
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 border-b pb-2">
        👥 Personnes de contact
      </h2>

      <div className="flex flex-col gap-6">
        {personnes.map((personne, index) => (
          <div key={index} className="grid md:grid-cols-3 gap-4 border p-4 rounded-lg shadow-sm bg-gray-50">
            <div>
              <label className="block mb-1 font-medium">Nom *</label>
              <InputText
                className="w-full"
                value={personne.NOM}
                onChange={(e) => handleChange(index, "NOM", e.target.value)}
              />
              {errors[index]?.NOM && <small className="text-red-500">{errors[index].NOM}</small>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Prénom *</label>
              <InputText
                className="w-full"
                value={personne.PRENOM}
                onChange={(e) => handleChange(index, "PRENOM", e.target.value)}
              />
              {errors[index]?.PRENOM && <small className="text-red-500">{errors[index].PRENOM}</small>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Lien de parenté *</label>
              <Dropdown
                className="w-full"
                options={liens}
                value={personne.LIEN_PARENTE}
                onChange={(e) => handleChange(index, "LIEN_PARENTE", e.value)}
                placeholder="Sélectionner"
              />
              {errors[index]?.LIEN_PARENTE && <small className="text-red-500">{errors[index].LIEN_PARENTE}</small>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Numéro de téléphone *</label>
              <InputText
                className="w-full"
                value={personne.NUMERO_TELEPHONE}
                onChange={(e) => handleChange(index, "NUMERO_TELEPHONE", e.target.value)}
              />
              {errors[index]?.NUMERO_TELEPHONE && (
                <small className="text-red-500">{errors[index].NUMERO_TELEPHONE}</small>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Email (optionnel)</label>
              <InputText
                className="w-full"
                value={personne.EMAIL}
                onChange={(e) => handleChange(index, "EMAIL", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Adresse de résidence</label>
              <InputText
                className="w-full"
                value={personne.ADRESSE_RESIDENCE}
                onChange={(e) => handleChange(index, "ADRESSE_RESIDENCE", e.target.value)}
              />
            </div>

            <div className="md:col-span-3 text-right">
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-text"
                onClick={() => supprimerPersonne(index)}
                tooltip="Supprimer cette personne"
              />
            </div>
          </div>
        ))}

        <div className="text-right">
          <Button icon="pi pi-plus" onClick={ajouterPersonne} />
        </div>

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
            onClick={handleNext}
            disabled={personnes.length === 0}
          />
        </div>
    </div>
  );
};

export default PersonnesContact;
