import React from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

const EtudesAnterieures = ({ data, updateFormData, onNext, onBack }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const isFormValid = data.NOM_DERNIERE_ECOLE_FREQUENTEE &&
                      data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE !== undefined &&
                      data.NOTE_EXAMEN_D_ETAT !== undefined;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold mb-2">Études antérieures</h2>

      <div>
        <label className="block mb-1 font-medium">Dernière école fréquentée</label>
        <InputText
          value={data.NOM_DERNIERE_ECOLE_FREQUENTEE || ""}
          onChange={(e) => handleChange("NOM_DERNIERE_ECOLE_FREQUENTEE", e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Note de la dernière école secondaire</label>
        <InputNumber
          value={data.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE ?? null}
          onValueChange={(e) => handleChange("NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE", e.value)}
          className="w-full"
          mode="decimal"
          min={0}
          max={100}
          showButtons
          suffix="%"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Note à l’examen d’État</label>
        <InputNumber
          value={data.NOTE_EXAMEN_D_ETAT ?? null}
          onValueChange={(e) => handleChange("NOTE_EXAMEN_D_ETAT", e.value)}
          className="w-full"
          mode="decimal"
          min={0}
          max={100}
          showButtons
          suffix="%"
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary" />
        <Button
          label="Suivant"
          icon="pi pi-arrow-right"
          iconPos="right"
          onClick={onNext}
          disabled={!isFormValid}
        />
      </div>
    </div>
  );
};

export default EtudesAnterieures;
