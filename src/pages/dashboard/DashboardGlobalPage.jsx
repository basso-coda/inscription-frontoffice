import React, { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import fetchApi from '../../helpers/fetchApi';
import DashboardSkeletons from '@/components/skeletons/DashboardSkeletons';
import { Button } from 'primereact/button';
import image from "../../assets/semaine-integration-etudiants.jpg"

const DashboardGlobalPage = () => {
    const cardStyle = {
        marginBottom: '15px',
        textAlign: 'center',
        width: '100%',
        padding: '8px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    };

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Dashboard - Vue d'ensemble"
    }, [])

    return (
        <div className="px-4 py-3 main_content">
            {/* Section d'accueil */}
            <div className="text-center mb-5">
                <h2 className="text-2xl font-bold mb-2">Bienvenue sur <span style={{ color: '#de9d0a' }}>monDossier</span></h2>
                <p className="text-gray-600 mb-4">Votre plateforme numérique pour simplifier les demandes d'admission à l'université BIU</p>
                <Button
                    label="Faire une demande d'admission"
                    icon="pi pi-send"
                    className="p-button-rounded rounded-button bg-yellow-400 p-button-lg"
                    style={{ fontSize: '18px', fontWeight: 'bold' }}
                    onClick={() => navigate('/demande-inscription')}
                />
            </div>

            {/* 📷 Image entre les sections */}
            <div className="text-center mb-5">
                <img
                    src={image}  // Remplace par le vrai chemin de ton image
                    alt="Bienvenue à BIU"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
            </div>

            {/* Bloc d'infos */}
            <div className="row">
                <div className="col-md-3">
                    <Card style={cardStyle}>
                        <h3 className="text-lg font-semibold mb-2">Conditions d'admission</h3>
                        <p className="text-sm text-gray-500">Découvrez les critères à remplir pour intégrer nos formations.</p>
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card style={cardStyle}>
                        <h3 className="text-lg font-semibold mb-2">Décision de l'université</h3>
                        <p className="text-sm text-gray-500">Suivez les étapes après la soumission de votre dossier.</p>
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card style={cardStyle}>
                        <h3 className="text-lg font-semibold mb-2">Bourses & aides</h3>
                        <p className="text-sm text-gray-500">Accédez aux opportunités de soutien financier disponibles.</p>
                    </Card>
                </div>
                <div className="col-md-3">
                    <Card style={cardStyle}>
                        <h3 className="text-lg font-semibold mb-2">Vie étudiante</h3>
                        <p className="text-sm text-gray-500">Explorez la vie sur le campus, les clubs et les événements étudiants.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DashboardGlobalPage;