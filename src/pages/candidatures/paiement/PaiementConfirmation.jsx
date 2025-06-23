import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

/**
 * Affiche une notification à l'utilisateur après retour de AfriPay
 */
const PaiementConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const message = params.get('message');

        if (status === 'success') {
            toast.current.show({ 
                severity: 'success', 
                summary: 'Paiement en attente', 
                detail: message || 'Veuillez suivre les instructions de votre opérateur pour approuver la transaction.', 
                life: 10000 
            });
            } else {
            toast.current.show({ 
                severity: 'error', 
                summary: 'Échec du paiement', 
                detail: message || 'Le paiement n’a pas été effectué.', 
                life: 10000 
            });
        }

            // Rediriger après quelques secondes
            const timer = setTimeout(() => {
            navigate('/dashboard'); // ou la page de ton choix
        }, 6000);

        return () => clearTimeout(timer);
    }, [location, navigate]);

    return (
        <div className="p-5">
            <Toast ref={toast} />
            <h3 className="text-center">Traitement du paiement...</h3>
        </div>
    );
};

export default PaiementConfirmation;
