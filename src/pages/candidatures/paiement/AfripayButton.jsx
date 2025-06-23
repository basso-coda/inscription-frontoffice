import React, { useEffect, useState } from 'react';
import fetchApi from '@/helpers/fetchApi';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, useParams } from 'react-router-dom';

const AfripayButton = () => {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [montant, setMontant] = useState(0);
    const { state } = useLocation()
    const params = state?.ID_CANDIDATURE ? state : useParams();

    const candidatureId = params.ID_CANDIDATURE

    useEffect(() => {
        const fetchTypes = async () => {
        try {
            const res = await fetchApi('/type_paiements'); 
            setTypes(res.data.rows); 
        } catch (err) {
            console.error('Erreur chargement types de paiement', err);
        }
        };

        fetchTypes();
    }, []);

    const handleTypeChange = (e) => {
        const id = parseInt(e.target.value);
        const selected = types.find(t => t.ID_TYPE_PAIEMENT === id);
        setSelectedType(selected);
        setMontant(selected.MONTANT);
    };

    const client_token = `${candidatureId}-${selectedType?.ID_TYPE_PAIEMENT || ''}`;

    return (
        <div className="p-3 border rounded mt-3">
        <h5>Paiement des frais</h5>

        <div className="form-group mb-3">
            <label>Type de paiement</label>
            <select className="form-control" onChange={handleTypeChange} value={selectedType?.ID_TYPE_PAIEMENT || ''}>
            <option value="">-- Choisir --</option>
            {types.map(type => (
                <option key={type.ID_TYPE_PAIEMENT} value={type.ID_TYPE_PAIEMENT}>
                {type.DESCRIPTION}
                </option>
            ))}
            </select>
        </div>

        {selectedType && (
            <form
            action="https://www.afripay.africa/checkout/index.php"
            method="post"
            >
            <input type="hidden" name="amount" value={montant} />
            <input type="hidden" name="currency" value="BIF" />
            <input type="hidden" name="comment" value={selectedType.DESCRIPTION} />
            <input type="hidden" name="client_token" value={client_token} />
            <input type="hidden" name="return_url" value="http://localhost:8080/paiement-confirmation" />
            <input type="hidden" name="app_id" value="3682705de3080ac264524f62c3c7c393" />
            <input type="hidden" name="app_secret" value="JDJ5JDEwJEpQT1RE" />

            <p className="mt-2">
                <strong>Montant à payer :</strong> {montant} BIF
            </p>

            {/* <button type="submit" className="btn btn-success">
                Payer avec AfriPay
            </button> */}

            <input type="image" src="https://www.afripay.africa/logos/pay_with_afripay.png" alt="Payer avec AfriPay" onclick="document.afripayform.submit();" />
            
            </form>
        )}
        </div>
    );
};

export default AfripayButton;
