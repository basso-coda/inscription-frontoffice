import React, { useState } from 'react';
import { Steps } from 'primereact/steps';
import { Button } from 'primereact/button';
import ChoixAcademique from './steps/ChoixAcademique';
import InformationsPersonnelles from './steps/InformationsPersonnelles';
import EtudesAnterieures from './steps/EtudesAnterieures';
import DocumentsExiges from './steps/DocumentsExiges';
import PersonnesContact from './steps/PersonnesContact';
import TermesConditions from './steps/TermesConditions';
import ResumeConfirmation from './steps/ResumeConfirmation';

export default function DemandeInscription() {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [formData, setFormData] = useState({
        ANNEE_ACADEMIQUE: "",
        CLASSE_ID: null,
        NOM: "",
        PRENOM: "",
        DATE_NAISSANCE: "",
        NATIONALITE_ID: null,
        NUM_CARTE_IDENTITE: "",
        COMMUNE_DELIVRANCE: "",
        DATE_DELIVRANCE: "",
        SEXE_ID: null,
        ETAT_CIVIL_ID: null,
        EMAIL_PRIVE: "",
        NUMERO_TELEPHONE_PRIVE: "",
        ADRESSE_RESIDENCE: "",
        NOM_DERNIERE_ECOLE_FREQUENTEE: "",
        NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE: null,
        NOTE_EXAMEN_D_ETAT: null,
        STATUT_CANDIDATURE: "",
        SECRETAIRE_ID: null,
        DOCUMENTS: {},
        PERSONNES_CONTACT: [],
        TERMS_ACCEPTED: false,

    });

    const markStepCompleted = (index) => {
        setCompletedSteps((prev) => [...new Set([...prev, index])]);
    }

    const steps = [
        { label: 'Choix académique' },
        { label: 'Infos personnelles' },
        { label: 'Études antérieures' },
        { label: 'Documents' },
        { label: 'Personnes de contact' },
        { label: 'Termes & Conditions' },
        { label: 'Résumé' },
    ].map((step, index) => ({
        ...step,
        ...(completedSteps.includes(index) && {
            icon: 'pi pi-check-circle text-green-500'
        }),
    }))

    const onNext = () => { 
        markStepCompleted(activeStep);
        setActiveStep((prev) => prev + 1);
    };
    const onBack = () => setActiveStep((prev) => prev - 1);

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const renderStepComponent = () => {
        switch (activeStep) {
            case 0:
                return <ChoixAcademique data={formData} updateFormData={updateFormData} onNext={onNext} />;
            case 1:
                return <InformationsPersonnelles data={formData} updateFormData={updateFormData} onNext={onNext} onBack={onBack} />;
            case 2:
                return <EtudesAnterieures data={formData} updateFormData={updateFormData} onNext={onNext} onBack={onBack} />;
            case 3:
                return <DocumentsExiges data={formData} updateFormData={updateFormData} onNext={onNext} onBack={onBack} />;
            case 4:
                return <PersonnesContact data={formData} updateFormData={updateFormData} onNext={onNext} onBack={onBack} />;
            case 5:
                return <TermesConditions data={formData} updateFormData={updateFormData} onNext={onNext} onBack={onBack} />;
            case 6:
                return <ResumeConfirmation data={formData} onBack={onBack} />;
            default:
                return null;
        }
    };

    return (
        <div className="container py-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div className="card p-4 max-w-4xl mx-auto">
                <Steps model={steps} activeIndex={activeStep} readOnly className="mb-6" />
                {renderStepComponent()}
            </div>
        </div>

    );
}
