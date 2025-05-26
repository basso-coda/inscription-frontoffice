import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { utilisateurs_routes_items } from "@/routes/administrations/utilisateurs_routes";
import { useApp } from "@/hooks/useApp";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { Panel } from "primereact/panel";

export default function NewUtilisateurPage() {
    const navigate = useNavigate();
    const { setBreadCrumbAction, setToastAction } = useApp()

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [profils, setProfils] = useState([])

    const [sexes, setSexes] = useState([
        { SEXE_ID: 1, SEXE_DESCRIPTION: 'Féminin' },
        { SEXE_ID: 2, SEXE_DESCRIPTION: 'Masculin' },
    ]);

    const initialValues = {
        NOM: "",
        PRENOM: "",
        USERNAME: "",
        EMAIL: "",
        TELEPHONE: "",

        PROFIL_ID: null,
        SEXE_ID: null,

        IMAGE: null,
    }

    const [data, setData] = useState(initialValues)

    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setIsSubmitting(true);

            const formData = new FormData();

            for (let key in data) {
                if (data[key]) {

                    switch (key) {
                        case 'PROFIL_ID': {
                            formData.append(key, data[key]?.ID_PROFIL);
                            break;
                        }

                        case 'SEXE_ID': {
                            formData.append(key, data[key]?.SEXE_ID)
                            break;
                        }

                        default:
                            formData.append(key, data[key]);
                    }
                }

            }
            // return console.log(data)
            const response = await fetchApi('/utilisateurs', {
                method: 'POST',
                body: formData,
            });

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            setErrors(null);

            navigate('/utilisateurs');

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

    const fetchProfils = async () => {
        try {
            const res = await fetchApi('/profils');
            setProfils(res.data.rows)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        document.title = utilisateurs_routes_items.new_utilisateur.name;

        setBreadCrumbAction([utilisateurs_routes_items.utilisateurs, utilisateurs_routes_items.new_utilisateur])

        fetchProfils();

        return () => {
            setBreadCrumbAction([]);
        };

    }, [])

    return (
        <>
            <div className="px-4 py-3 main_content bg-white has_footer">

                <div className="">
                    <h1 className="mb-3">Nouvel utilisateur</h1>
                    <hr className="w-100" />
                </div>

                <form className="form w-full mt-5" onSubmit={handleSubmit}>
                    <Panel header="Identification" toggleable>
                        <div className="form-group col-sm">
                            <div className="row">
                                <div className="col-4">
                                    <div>
                                        <label htmlFor="NOM" className="label mb-1">Nom
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <InputText autoFocus type="text" placeholder="Ecrire votre nom" id="NOM" name="NOM" value={data.NOM} onChange={e => setData(d => ({ ...d, NOM: e.target.value }))} className={`w-100 is-invalid ${errors?.NOM ? 'p-invalid' : ''}`} />

                                    {errors?.NOM && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.NOM}
                                    </div>}
                                </div>

                                <div className="col-4">
                                    <div>
                                        <label htmlFor="PRENOM" className="label mb-1">Prénom
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <InputText type="text" placeholder="Ecrire votre prenom" id="PRENOM" name="PRENOM" value={data.PRENOM} onChange={e => setData(d => ({ ...d, PRENOM: e.target.value }))} className={`w-100 is-invalid ${errors?.PRENOM ? 'p-invalid' : ''}`} />

                                    {errors?.PRENOM && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.PRENOM}
                                    </div>}
                                </div>

                                <div className="col-4">
                                    <div>
                                        <label htmlFor="USERNAME" className="label mb-1">Nom d'utilisateur
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <InputText type="text" placeholder="Ecrire votre nom d'utilisateur" id="USERNAME" name="USERNAME" value={data.USERNAME} onChange={e => setData(d => ({ ...d, USERNAME: e.target.value }))} className={`w-100 is-invalid ${errors?.USERNAME ? 'p-invalid' : ''}`} />

                                    {errors?.USERNAME && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.USERNAME}
                                    </div>}
                                </div>
                            </div>

                        </div>

                        <div className="form-group col-sm mt-5">
                            <div className="row">
                                <div className="col-4">
                                    <div>
                                        <label htmlFor="EMAIL" className="label mb-1">Email
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <InputText type="text" placeholder="Ecrire votre email" id="EMAIL" name="EMAIL" value={data.EMAIL} onChange={e => setData(d => ({ ...d, EMAIL: e.target.value }))} className={`w-100 is-invalid ${errors?.EMAIL ? 'p-invalid' : ''}`} />

                                    {errors?.EMAIL && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.EMAIL}
                                    </div>}
                                </div>

                                <div className="col-4">
                                    <div>
                                        <label htmlFor="sexe" className="label mb-1">Sexe
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>
                                    <div>
                                        <Dropdown
                                            id="sexe"
                                            name="sexe"
                                            value={data.SEXE_ID}
                                            onChange={(e) => setData(d => ({ ...d, SEXE_ID: e.value }))}
                                            options={sexes}
                                            optionLabel="SEXE_DESCRIPTION"
                                            placeholder="Selectionner le sexe"
                                            filter
                                            style={{ borderRadius: 0 }}
                                            className="w-full" />
                                    </div>

                                    {errors?.SEXE_ID && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.SEXE_ID}
                                    </div>}
                                </div>
                                <div className="col-4">
                                    <div>
                                        <label htmlFor="profil" className="label mb-1">Profil
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <div>
                                        <Dropdown
                                            id="profil"
                                            name="profil"
                                            value={data.PROFIL_ID}
                                            onChange={(e) => setData(d => ({ ...d, PROFIL_ID: e.value }))}
                                            options={profils}
                                            optionLabel="DESCRIPTION"
                                            placeholder="Selectionner le profil"
                                            filter
                                            style={{ borderRadius: 0 }}
                                            className="w-full" />
                                    </div>

                                    {errors?.PROFIL_ID && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.PROFIL_ID}
                                    </div>}
                                </div>
                            </div>
                        </div>

                        <div className="form-group col-sm mt-5">
                            <div className="row">
                                <div className="col-6">
                                    <div>
                                        <label htmlFor="TELEPHONE" className="label mb-1">Numéro téléphone
                                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                        </label>
                                    </div>

                                    <InputText type="text" placeholder="Ecrire votre numéro téléphone" id="TELEPHONE" name="TELEPHONE" value={data.TELEPHONE} onChange={e => setData(d => ({ ...d, TELEPHONE: e.target.value }))} className={`w-100 is-invalid ${errors?.TELEPHONE ? 'p-invalid' : ''}`} />
                                    {errors?.TELEPHONE && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.TELEPHONE}
                                    </div>}
                                </div>
                                <div className="col-6">
                                    <div>
                                        <label htmlFor="IMAGE" className="label mb-1">Profile photo</label>
                                    </div>

                                    <FileUpload
                                        style={{ borderRadius: 0 }}
                                        chooseLabel={`choisir l'image`}
                                        cancelLabel={`Enlever`}
                                        name="signature"
                                        uploadOptions={{
                                            style: { display: "none" },
                                        }}
                                        className="p-invalid"
                                        accept="image/*"
                                        maxFileSize={200000}
                                        invalidFileSizeMessageDetail={`L'image est volumineuse`}
                                        emptyTemplate={
                                            <p className="m-0">{`Glisser-déposer`}</p>
                                        }
                                        onSelect={async (e) => {
                                            const file = e.files[0];
                                            setData(d => ({ ...d, "IMAGE": file }))
                                        }}
                                        onClear={() => {
                                            setData(d => ({ ...d, "IMAGE": null }))
                                        }}
                                    />

                                    {errors?.IMAGE && <div
                                        className="invalid-feedback"
                                        style={{ minHeight: 0, display: "block" }}
                                    >
                                        {errors?.IMAGE}
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">
                        {/* <Button label="Reinitialiser" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            e.preventDefault()
                            setData(initialValues)
                            setErrors(null)
                        }} /> */}

                        <Button label="Envoyer" type="submit" className="mt-3 ml-3 bitwi-button" size="small" disabled={isSubmitting} loading={isSubmitting} />
                    </div>
                </form >
            </div >
        </>
    )
}