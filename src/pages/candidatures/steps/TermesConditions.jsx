// import React from "react";
// import { Checkbox } from "primereact/checkbox";
// import { Button } from "primereact/button";

// const TermesConditions = ({ data, updateFormData, onBack, onNext }) => {
//     const handleAccept = (e) => {
//         updateFormData({ TERMS_ACCEPTED: e.checked });
//     };

//     return (
//         <div className="flex flex-col gap-4 max-w-3xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4 text-center text-blue-900 border-b pb-2">
//                 📜 Termes et conditions
//             </h2>

//             <div className="p-4 border rounded bg-gray-50 max-h-64 overflow-auto text-justify text-sm leading-relaxed">
//                 <p>
//                     En soumettant cette demande, je certifie que les informations fournies sont exactes.
//                     Je comprends que toute fausse déclaration peut entraîner le rejet de ma candidature.
//                     J’accepte que mes données soient utilisées par l’université à des fins d’évaluation académique et administrative.
//                 </p>
//                 <p className="mt-2">
//                     Je consens également à respecter les règlements de l’université, y compris ceux relatifs à la vie académique,
//                     disciplinaire et aux paiements.
//                 </p>
//                 <p className="mt-2">
//                     Pour plus de détails, veuillez consulter la politique de confidentialité et les règlements sur notre site officiel.
//                 </p>
//             </div>

//             <div className="flex items-center gap-2 mt-2">
//                 <Checkbox inputId="terms" checked={data.TERMS_ACCEPTED || false} onChange={handleAccept} />
//                 <label htmlFor="terms" className="text-sm">
//                     J’ai lu et j’accepte les termes et conditions
//                 </label>
//             </div>

//             <div className="flex justify-between mt-4">
//                 <Button label="Retour" icon="pi pi-arrow-left" onClick={onBack} className="p-button-secondary rounded-button" />
//                 <Button
//                     label="Soumettre"
//                     icon="pi pi-check"
//                     iconPos="right"
//                     className="bg-yellow-400 rounded-button"
//                     onClick={onNext}
//                     disabled={!data.TERMS_ACCEPTED}
//                 />
//             </div>
//         </div>
//     );
// };

// export default TermesConditions;




import React from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const TermesConditions = ({ data, updateFormData, onBack, onNext }) => {
    const handleAccept = (e) => {
        updateFormData({ TERMS_ACCEPTED: e.checked });
    };

    return (
        <div className="">
            <div className="text-center mb-5">
                <h2 className="text-2xl font-bold mb-4 text-center text-blue-900 border-b pb-2">
                    📜 Termes et conditions
                </h2>
            </div>
            

            <div className="flex-1 overflow-auto">
                <div className="p-4 border rounded bg-gray-50 max-h-72 overflow-y-auto text-justify text-sm leading-relaxed">
                    <p>
                        En soumettant cette demande, je certifie que les informations fournies sont exactes.
                        Je comprends que toute fausse déclaration peut entraîner le rejet de ma candidature.
                        J’accepte que mes données soient utilisées par l’université à des fins d’évaluation académique et administrative.
                    </p>
                    <p className="mt-2">
                        Je consens également à respecter les règlements de l’université, y compris ceux relatifs à la vie académique,
                        disciplinaire et aux paiements.
                    </p>
                    <p className="mt-2">
                        Pour plus de détails, veuillez consulter la politique de confidentialité et les règlements sur notre site officiel.
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <Checkbox inputId="terms" checked={data.TERMS_ACCEPTED || false} onChange={handleAccept} />
                    <label htmlFor="terms" className="text-sm">
                        J’ai lu et j’accepte les termes et conditions
                    </label>
                </div>
            </div>

            {/* Zone des boutons toujours visible */}
            <div className="flex justify-between pt-4 border-t">
                <Button
                    label="Retour"
                    icon="pi pi-arrow-left"
                    onClick={onBack}
                    className="p-button-secondary rounded-button"
                />
                <Button
                    label="Soumettre"
                    icon="pi pi-check"
                    iconPos="right"
                    className="bg-yellow-400 rounded-button text-white"
                    onClick={onNext}
                    disabled={!data.TERMS_ACCEPTED}
                />
            </div>
        </div>
    );
};

export default TermesConditions;
