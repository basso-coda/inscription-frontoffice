import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import fetchApi from "@/helpers/fetchApi";
import { Button } from "primereact/button";

const ChoixAcademique = ({ data, updateFormData, onNext }) => {
  const [facultes, setFacultes] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // fonction qui calcule l'année académique
  const getAnneeAcademique = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 9 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resFac = await fetchApi("/facultes");
        const resDep = await fetchApi("/departements");
        const resCla = await fetchApi("/classes");

        setFacultes(resFac.data.rows.map(f => ({ 
            code: f.ID_FACULTE, 
            name: f.DESCRIPTION, 
        })));
        setDepartements(resDep.data.rows.map(d => ({
          code: d.ID_DEPARTEMENT,
          name: d.DESCRIPTION,
          FACULTE_ID: d.FACULTE_ID,
        })));
        setClasses(resCla.data.rows.map(c => ({
          code: c.ID_CLASSE,
          name: c.DESCRIPTION,
          DEPARTEMENT_ID: c.DEPARTEMENT_ID,
        })));

        // Initialiser l'année académique si elle n’est pas encore définie
        if (!data.ANNEE_ACADEMIQUE) {
          updateFormData({ ANNEE_ACADEMIQUE: getAnneeAcademique() });
        }

      } catch (err) {
        console.error("Erreur de chargement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFaculteChange = (faculteId) => {
    updateFormData({
        FACULTE_ID: faculteId,
        DEPARTEMENT_ID: null,
        CLASSE_ID: null
    });
  };

  const handleDepartementChange = (departementId) => {
    updateFormData({
        DEPARTEMENT_ID: departementId,
        CLASSE_ID: null
    });
  };

  const handleClasseChange = (classeId) => {
    updateFormData({ CLASSE_ID: classeId });
  };

  const departementsFiltres = departements.filter(d => d.FACULTE_ID === data.FACULTE_ID);
  const classesFiltres = classes.filter(c => c.DEPARTEMENT_ID === data.DEPARTEMENT_ID);

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold mb-2">Choix académique</h2>

      {loading ? (
        <>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </>
      ) : (
        <>
            <div>
                <label className="block mb-1 font-medium">Année académique</label>
                <input 
                    type="text" 
                    value={data.ANNEE_ACADEMIQUE || ''}
                    readOnly
                    className="w-full p-inputtext p-component bg-gray-100"
                />
            </div>
            <div>
                <label className="block font-medium mb-1">Faculté</label>
                <Dropdown
                value={data.FACULTE_ID ?? null}
                onChange={(e) => handleFaculteChange(e.value)}
                options={facultes}
                optionLabel="name"
                optionValue="code"
                placeholder="Sélectionnez une faculté"
                className="w-full"
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Département</label>
                <Dropdown
                value={data.DEPARTEMENT_ID ?? null}
                onChange={(e) => handleDepartementChange(e.value)}
                options={departementsFiltres}
                optionLabel="name"
                optionValue="code"
                placeholder="Sélectionnez un département"
                className="w-full"
                disabled={!data.FACULTE_ID}
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Classe souhaitée</label>
                <Dropdown
                value={data.CLASSE_ID ?? null}
                onChange={(e) => handleClasseChange(e.value)}
                options={classesFiltres}
                optionLabel="name"
                optionValue="code"
                placeholder="Sélectionnez une classe"
                className="w-full"
                disabled={!data.DEPARTEMENT_ID}
                />
            </div>

            <div className="flex justify-end mt-4">
                <Button
                  label="Suivant"
                  icon="pi pi-arrow-right"
                  className="bg-yellow-400 rounded-button"
                  onClick={onNext}
                  disabled={!data.CLASSE_ID}
                />
            </div>
        </>
      )}
    </div>
  );
};

export default ChoixAcademique;
