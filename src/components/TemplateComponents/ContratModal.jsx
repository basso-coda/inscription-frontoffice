

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from "primereact/inputtextarea";
import { useApp } from "@/hooks/useApp";
import fetchApi from "@/helpers/fetchApi";
import { useAuth } from "@/hooks/useAuth";


export default function ContratModal({ visible, setVisible, dataContrat }) {

    const { setBreadCrumbAction, setToastAction } = useApp()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, handleLogout } = useAuth()
    const [ Statusdata, setStatusdata ] = useState([])


   
    const cities = [
        { STATUS_CONTRAT: 'EN COURS', ID_CONTRA_STATUS: '1' },
        { STATUS_CONTRAT: 'SUSPENDU', ID_CONTRA_STATUS: '2' },
        { STATUS_CONTRAT: 'TERMINER', ID_CONTRA_STATUS: '3' },
        { STATUS_CONTRAT: 'RENOUVELER', ID_CONTRA_STATUS: '4' },
        { STATUS_CONTRAT: 'CHNANGER', ID_CONTRA_STATUS: '5' }
    ];
    const filterCitiesById =cities.filter(city => city.ID_CONTRA_STATUS == dataContrat?.ID_CONTRAT);
    const initialValues = {
        ID_CONTRA_STATUS:"",
        DESCRIPTION: "",
        USER_ID: user?.data?.ID_UTILISATEUR,
       
    }

      
   
    const [data, setData] = useState(initialValues)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("ID_EMPLOYE",dataContrat?.ID_EMPLOYE)
            formData.append("PATH_CONTRAT",dataContrat?.PATH_CONTRAT)
            // formData.append("PATH_DEMISSION",dataContrat?.PATH_DEMISSION)
            formData.append("TYPE_CONTRAT",dataContrat?.TYPE_CONTRAT)
            formData.append("DATE_DEBUT",dataContrat?.DATE_DEBUT)
            formData.append("DATE_FIN",dataContrat?.DATE_FIN)
            formData.append("DATE_SIGNATURE",dataContrat?.DATE_SIGNATURE)
            formData.append("SALAIRE_BASE",dataContrat?.SALAIRE_BASE)
            formData.append("COMMENTAIRE", data?.DESCRIPTION)
            formData.append("STATUT_ID", data?.ID_CONTRA_STATUS.ID_CONTRA_STATUS)
            formData.append("USER_ID", data?.USER_ID)

            
            formData.append("ID_CONTRAT", dataContrat?.ID_CONTRAT)
            // STATUT_ID
            const response = await fetchApi('/Contrat/status', {
                method: 'PUT',
                body: formData,
            });

            setIsSubmitting(false);
            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })
            setVisible(false);
        } catch (response) {
            setIsSubmitting(false);
            if (response.httpStatus === 422) {
                setErrors(response.errors);
            }

            setToastAction({
                severity: "error",
                summary: "Erreur",
                detail: response.message,
                life: 3000,
            })
        } 
    };

    
  const getStatuContrat = useCallback(async () => {
    try {
      const {data} = await fetchApi("/StatusContrat");
      setStatusdata(data)
     
    } catch (response) {
      // console.log(response)

    } 
  }, []);
  
  useEffect(() => {
    getStatuContrat();
  }, []);
  
    return (
        <div className="card flex justify-content-center">
            {/* <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} /> */}

            <Dialog header="Contrat" visible={visible}
                onHide={() => { if (!visible) return; setVisible(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form className="form w-full mt-5" onSubmit={handleSubmit} >

                    <p>
                       
                            <b>STATUS ACTUEL {filterCitiesById[0]?.STATUS_CONTRAT}</b>
                        
                    </p>

                    {/* debut */}
                    <div className="col-lg-6">
                        <div>
                            <label htmlFor="NOM" className="label mb-1">Employe
                                <span style={{ color: 'red', fontSize: 18 }}>*</span>
                            </label>
                        </div>
                        <Dropdown value={data.ID_CONTRA_STATUS}
                         onChange={e => setData(d => ({ ...d, ID_CONTRA_STATUS: e.value }))}
                            options={Statusdata} optionLabel="STATUS_CONTRAT"
                            placeholder="Selectionner status" className="w-full " />
                    </div>
                    {/* fin debut */}
                     {/* debut */}
                     <div className="col-lg-6">
                                    <div>
                                        <label htmlFor="NOM" className="label mb-1">Motif
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>
                                    <InputTextarea 
                                     value={data.DESCRIPTION} 
                                     className="w-full " 
                                     required
                                     onChange={e => setData(d => ({ ...d, DESCRIPTION: e.target.value }))} 
                                    rows={5} cols={30} />
                                </div>
                                {/* fin debut */}
                                <Button label="Envoyer" type="submit" className="bitwi-button" size="small"
                                 disabled={isSubmitting} 
                                 loading={isSubmitting} />


                    
                </form>

            </Dialog>
        </div>
    )
}
