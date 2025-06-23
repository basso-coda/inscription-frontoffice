import React, { useEffect, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";

const DocumentsExiges = ({ data, updateFormData, onNext, onBack }) => {
  const [documentsExiges, setDocumentsExiges] = useState([]);
  const [fileUploadKeys, setFileUploadKeys] = useState({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetchApi("/type_documents");
        setDocumentsExiges(res.data.rows);
      } catch (err) {
        console.error("Erreur lors du chargement des documents", err);
      }
    };

    fetchDocuments();
  }, []);

  const handleUpload = (e, typeDocId) => {
    const file = e.files[0];
    if (!file) return;

    const updated = {
      ...data.DOCUMENTS,
      [typeDocId]: file,
    };

    updateFormData({ DOCUMENTS: updated });
  };

  const removeFile = (typeDocId) => {
    const updated = { ...data.DOCUMENTS };
    delete updated[typeDocId];
    updateFormData({ DOCUMENTS: updated });

    // Réinitialise le composant FileUpload
    setFileUploadKeys(prev => ({
      ...prev,
      [typeDocId]: (prev[typeDocId] || 0) + 1
    }));
  };

  const documentsFournis = data.DOCUMENTS ? Object.keys(data.DOCUMENTS).length : 0;
  const pourcentage = documentsExiges.length
    ? (documentsFournis / documentsExiges.length) * 100
    : 0;

  return (
    // <div className="grid gap-4">
    //   <h2 className="text-xl font-semibold mb-2">Téléversement des documents</h2>

    //   {documentsExiges.map((doc) => (
    //     <div key={doc.ID_TYPE_DOCUMENT}>
    //       <label className="block mb-1 font-medium">{doc.DESCRIPTION}</label>
    //       <FileUpload
    //         mode="basic"
    //         chooseLabel="Choisir un fichier"
    //         customUpload
    //         uploadHandler={(e) => handleUpload(e, doc.ID_TYPE_DOCUMENT)}
    //         auto
    //       />
    //       {data.DOCUMENTS?.[doc.ID_TYPE_DOCUMENT] && (
    //         <small className="text-green-600">Document ajouté ✔</small>
    //       )}
    //     </div>
    //   ))}

    //   <div className="flex justify-between mt-4">
    //     <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary" />
    //     <Button
    //       label="Suivant"
    //       icon="pi pi-arrow-right"
    //       iconPos="right"
    //       onClick={onNext}
    //       disabled={pourcentage < 50}
    //     />
    //   </div>

    //   <small className="text-gray-500 italic">
    //     Vous devez fournir au moins 50% des documents demandés pour continuer.
    //   </small>
    // </div>

    <div className="p-4 border rounded-xl shadow-md bg-white">
      {/* TITRE */}
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900 border-b pb-2">
        📄 Téléversement des documents exigés
      </h2>

      {/* DOCUMENTS À FOURNIR */}
      <div className="grid gap-5">
        {documentsExiges.map((doc) => (
          <div key={doc.ID_TYPE_DOCUMENT} className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">{doc.DESCRIPTION}</label>
            <FileUpload
              key={fileUploadKeys[doc.ID_TYPE_DOCUMENT] || 0}
              mode="basic"
              chooseLabel="Choisir un fichier"
              customUpload
              uploadHandler={(e) => handleUpload(e, doc.ID_TYPE_DOCUMENT)}
              auto
              accept=".pdf,.jpg,.jpeg,.png"
              maxFileSize={5 * 1024 * 1024}
              className="w-full"
            />
            {data.DOCUMENTS?.[doc.ID_TYPE_DOCUMENT] && (
              <div className="flex items-center gap-2">
                <small className="text-green-600">✅ Document ajouté</small>
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-danger p-0"
                  tooltip="Retirer ce document"
                  onClick={() => removeFile(doc.ID_TYPE_DOCUMENT)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* POURCENTAGE D'AVANCEMENT */}
      <div className="mt-4 text-sm italic text-gray-600 text-center">
        {pourcentage < 50 ? (
          <>⚠️ Vous devez fournir au moins <strong>50%</strong> des documents pour continuer.</>
        ) : (
          <>✅ Assez de documents fournis pour continuer.</>
        )}
      </div>

      {/* BOUTONS DE NAVIGATION */}
      <div className="flex justify-between mt-6">
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
          disabled={pourcentage < 50}
        />
      </div>
    </div>
  );
};

export default DocumentsExiges;
