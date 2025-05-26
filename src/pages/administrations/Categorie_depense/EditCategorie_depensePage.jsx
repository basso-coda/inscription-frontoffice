import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { useEffect, useState } from "react";
import { Depense_routes_items } from "@/routes/Depense/index";
import { useApp } from "@/hooks/useApp";

import { useLocation,useNavigate } from 'react-router-dom';
import { Panel } from "primereact/panel";
import { InputTextarea } from "primereact/inputtextarea";
import { FormattedMessage } from "react-intl";

export default function EditCategorie_depensePage() {
    const navigate = useNavigate();
    const  location= useLocation();

    const MyCarriere=  location.state

    const { setBreadCrumbAction, setToastAction } = useApp()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
       
        DESC_CATEGORIE_DEPENSE: MyCarriere?.DESC_CATEGORIE_DEPENSE,
    }

    const [data, setData] = useState(initialValues)

    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("DESC_CATEGORIE_DEPENSE", data?.DESC_CATEGORIE_DEPENSE);
           
            formData.append("ID_CATEGORIE_DEPENSE", MyCarriere?.ID_CATEGORIE_DEPENSE)
            
            const response = await fetchApi('/CategorieDepense/update', {
                method: 'PUT',
                body: formData,
            });

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            setErrors(null);

            navigate('/Categorie_depense');

        } catch (response) {
            if (response.httpStatus === 422) {
                setErrors(response.errors);
            }

            setToastAction({
                severity: "error",
                summary: "Erreur",
                detail: response.message,
                life: 3000,
            })
        } finally {
            setIsSubmitting(false);

        }
    };

    useEffect(() => {
        document.title = Depense_routes_items.Depense.name;

        setBreadCrumbAction([Depense_routes_items.Depense,Depense_routes_items.new_Depense])
        return () => {
            setBreadCrumbAction([]);
        };

    }, [])

    return (
        <>
            <div className="px-4 py-3 main_content bg-white has_footer">

                <div className="">
                    <h1 className="mb-3">
                    <FormattedMessage id="edit-categori-depense"/> </h1>
                    <hr className="w-100" />
                </div>

                <form className="form w-full mt-5" onSubmit={handleSubmit} >
                    <Panel header="Identification" toggleable>
                        <div className="form-group col-sm">
                            <div className="row">
                               
                                <div className="col-lg-6">
                                    <div>
                                        <label htmlFor="DESC_CATEGORIE_DEPENSE" className="label mb-1">
                                        <FormattedMessage id="desc-depense"/>
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>
                                    <InputTextarea value={data.DESC_CATEGORIE_DEPENSE}
                                     id="DESC_CATEGORIE_DEPENSE"  
                                     placeholder="Ecrire votre DESC_CATEGORIE_DEPENSE"
                                     className={`w-100 is-invalid ${errors?.DESC_CATEGORIE_DEPENSE ? 'p-invalid' : ''}`} 
                                     onChange={e => setData(d => ({ ...d, DESC_CATEGORIE_DEPENSE: e.target.value }))} 
                                    rows={5} cols={30} />
                                    {errors?.DESC_CATEGORIE_DEPENSE && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.DESC_CATEGORIE_DEPENSE}
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </Panel>

                  

                  <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">
                        <Button label="Reinitialiser" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            e.preventDefault()
                            setData(initialValues)
                            setErrors(null)
                        }} />

                        <Button label="Envoyer" type="submit" className="bitwi-button" size="small" disabled={isSubmitting} loading={isSubmitting} />
                    </div>
                </form >
            </div >
        </>
    )
}