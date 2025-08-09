// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Toast } from 'primereact/toast';
// import { useRef } from 'react';

// /**
//  * Affiche une notification à l'utilisateur après retour de AfriPay
//  */
// const PaiementConfirmation = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const toast = useRef(null);

//     useEffect(() => {
//         const params = new URLSearchParams(location.search);
//         const status = params.get('status');
//         const message = params.get('message');

//         if (status === 'success') {
//             toast.current.show({ 
//                 severity: 'success', 
//                 summary: 'Paiement en attente', 
//                 detail: message || 'Veuillez suivre les instructions de votre opérateur pour approuver la transaction.', 
//                 life: 10000 
//             });
//             } else {
//             toast.current.show({ 
//                 severity: 'error', 
//                 summary: 'Échec du paiement', 
//                 detail: message || 'Le paiement n’a pas été effectué.', 
//                 life: 10000 
//             });
//         }

//             // Rediriger après quelques secondes
//             const timer = setTimeout(() => {
//             navigate('/dashboard'); // ou la page de ton choix
//         }, 6000);

//         return () => clearTimeout(timer);
//     }, [location, navigate]);

//     return (
//         <div className="p-5">
//             <Toast ref={toast} />
//             <h3 className="text-center">Traitement du paiement...</h3>
//         </div>
//     );
// };

// export default PaiementConfirmation;







import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

/**
 * Affiche une notification et des instructions après le retour d'AfriPay
 */
const PaiementConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const statusParam = params.get('status');
        const messageParam = params.get('message');

        setStatus(statusParam);
        setMessage(decodeURIComponent(messageParam || ''));
    }, [location]);

    const handleClose = () => {
        setVisible(false);
        navigate('/dashboard'); // ou autre page cible
    };

    const renderContent = () => {
        if (status === 'success') {
            return (
                <div>
                    <h4>Paiement en attente de validation</h4>
                    <p>Votre demande de paiement a été envoyée avec succès.</p>
                    <p>
                        <strong>Instructions :</strong><br />
                        {message 
                            // || 
                            // (
                            //     <span>
                            //         Veuillez composer <strong>*163#</strong> sur votre téléphone,
                            //         puis suivre :<br />
                            //         → <strong>4. Payer facture</strong><br />
                            //         → <strong>2. Approuver les transactions</strong><br />
                            //         → <strong>1. Afriregister</strong>
                            //     </span>
                            // )
                        }
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>Échec du paiement</h4>
                    <p>{message 
                        // || 
                        // "Le paiement n’a pas été effectué."
                    }</p>
                </div>
            );
        }
    };

    return (
        <div>
            <Dialog
                header="Confirmation du paiement"
                visible={visible}
                style={{ width: '40vw' }}
                onHide={handleClose}
                footer={<Button label="Fermer" icon="pi pi-check" onClick={handleClose} autoFocus />}
                closable={false}
                modal
            >
                {renderContent()}
            </Dialog>
        </div>
    );
};

export default PaiementConfirmation;

