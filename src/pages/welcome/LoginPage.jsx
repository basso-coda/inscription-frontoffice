import React, { useEffect, useState } from "react";

import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import fetchApi from "@/helpers/fetchApi";
import { useApp } from "@/hooks/useApp";
import Logo from "../../assets/biu-logo.jpg";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

const LoginPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visiblePassowrd, setVisiblePassowrd] = useState(false);
    const { user, handleLogin } = useAuth();
    const { setToastAction } = useApp();
    const [isLoginView, setIsLoginView] = useState(true);
    const [sexes, setSexes] = useState([
        { SEXE_ID: 1, SEXE_DESCRIPTION: 'Féminin' },
        { SEXE_ID: 2, SEXE_DESCRIPTION: 'Masculin' },
    ])

    const initialValues = {
        EMAIL: "",
        MOT_DE_PASSE: "",
        NOM: "",
        PRENOM: "",
        USERNAME: "",
        TELEPHONE: "",
        SEXE_ID: null,
        IMAGE: null
    };

    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setIsSubmitting(true);

            const response = await fetchApi('/login-candidat', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            await handleLogin(response.data);

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            setErrors(null);

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

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            setIsSubmitting(true);

            const formData = new FormData();

            for (let key in data) {
                if (data[key]) {

                    switch (key) {
                        
                        case 'SEXE_ID': {
                            formData.append(key, data[key]?.SEXE_ID)
                            break;
                        }

                        default:
                            formData.append(key, data[key]);
                    }
                }

            }

            // Envoyer directement l'id du profil correspondant à celui du candidat
            formData.append('PROFIL_ID', 4);

            const response = await fetchApi('/creation-compte', {
                method: 'POST',
                body: formData
            });

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            });

            setErrors(null);
            setIsLoginView(true); // Rediriger vers le formulaire de connexion  
        } catch (response) {
            if (response.httpStatus === 422) {
                setErrors(response.errors)
            }

            setToastAction({
                severity: 'error',
                summary: "Erreur",
                detail: response.message,
                life: 3000,
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        document.title = 'Login';
    }, [])

    if (user.data) {
        return <Navigate replace to={'/dashboard'} />
    }

    return (
        <div className="p-3 main_content w-full login">
            <div className="row">
                <div className="col-md-10 login-area mx-auto">
                    <div className="row">
                        <div className="col-md-6 login-left d-flex align-items-center justify-content-center" style={{background:'white'}}>

                            <div className="w-100 text-center">
                                <Link to="#">
                                    <img
                                        src={Logo}
                                        alt="Logo"
                                        // style={{ height: "160px", width: "160px" }}
                                    />
                                </Link>
                            </div>

                        </div>
                        <div className="col-md-6 login-right">
                            <Card className="m-0 py-0 login-form-area">
                                <div className="p-d-flex p-flex-column mt-1">
                                    <div className="w-100 d-flex justify-content-center">
                                        <label className="text-center">
                                            {isLoginView ? (
                                                <span>
                                                    <h4>Connexion</h4>
                                                    <small>Veuillez s'il vous plaît entrer votre <br /> nom d'utilisateur et votre mot de passe.</small>
                                                </span>
                                            ) : (
                                                <span>
                                                    <h4>Création d'un compte</h4>
                                                    <small>Veuillez s'il vous plaît completer le formulaire</small>
                                                </span>
                                            )
                                            }
                                        </label>
                                    </div>
                                </div>

                                <div className="w-100 d-flex flex-column align-items-center justify-content-center bg-white">
                                    {isLoginView ? (
                                        <form
                                        action=""
                                        method="POST"
                                        className="form w-75"
                                        onSubmit={handleSubmit}
                                        >
                                            <div className="form-group w-100">
                                                <label htmlFor="EMAIL" className="label mb-1">
                                                    Email
                                                </label>

                                                <div className="col-sm">
                                                    <InputText
                                                        type="email"
                                                        id="EMAIL"
                                                        name="EMAIL"
                                                        value={data.EMAIL}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, EMAIL: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.EMAIL ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.EMAIL && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.EMAIL}
                                                    </div>}
                                                </div>
                                            </div>

                                            <div className="form-group w-100 mt-3">
                                                <label htmlFor="MOT_DE_PASSE" className="label mb-1">
                                                    Mot de passe
                                                </label>

                                                <div className="col-sm relative">
                                                    <InputText
                                                        required
                                                        type={visiblePassowrd ? "text" : "password"}
                                                        style={{ borderRadius: "0px", width: "100%" }}
                                                        id="MOT_DE_PASSE"
                                                        name="MOT_DE_PASSE"
                                                        value={data.MOT_DE_PASSE}
                                                        onChange={e => setData(data => ({ ...data, MOT_DE_PASSE: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.MOT_DE_PASSE ? "p-invalid" : ""}`}

                                                    />

                                                    <span
                                                        className="p-input-icon-right absolute"
                                                        style={{ top: "25px", right: "20px" }}
                                                    >
                                                        {!visiblePassowrd ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                className="bi bi-eye cursor-pointer"
                                                                viewBox="0 0 16 16"
                                                                onClick={() => setVisiblePassowrd((b) => !b)}
                                                            >
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                fill="currentColor"
                                                                className="bi bi-eye-slash cursor-pointer"
                                                                viewBox="0 0 16 16"
                                                                onClick={() => setVisiblePassowrd((b) => !b)}
                                                            >
                                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                                            </svg>
                                                        )}
                                                    </span>

                                                    {errors?.MOT_DE_PASSE && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.MOT_DE_PASSE}
                                                    </div>}
                                                </div>
                                            </div>

                                            <center>
                                                <Button
                                                    label="Se connecter"
                                                    icon="pi pi-sign-in"
                                                    type="submit"
                                                    className="center mt-4 bitwi-button rounded-button"
                                                    size="small"
                                                    loading={isSubmitting}
                                                /> <br />
                                                {/* <Button
                                                    label={isLoginView ? "Créer un compte" : "J'ai déjà un compte"}
                                                    link
                                                    className="mt-3"
                                                    onClick={() => setIsLoginView(!isLoginView)}
                                                /> */}
                                            </center>
                                        </form>
                                    ) : (
                                        <form className="form w-75" onSubmit={handleRegister}>
                                            <div className="form-group w-100">
                                                <label htmlFor="NOM" className="label mb-1">
                                                    Nom
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <InputText
                                                        type="text"
                                                        id="NOM"
                                                        name="NOM"
                                                        value={data.NOM}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, NOM: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.NOM ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.NOM && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.NOM}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="form-group w-100">
                                                <label htmlFor="PRENOM" className="label mb-1">
                                                    Prenom
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <InputText
                                                        type="text"
                                                        id="PRENOM"
                                                        name="PRENOM"
                                                        value={data.PRENOM}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, PRENOM: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.PRENOM ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.PRENOM && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.PRENOM}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="form-group w-100">
                                                <label htmlFor="USERNAME" className="label mb-1">
                                                    Username
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <InputText
                                                        type="text"
                                                        id="USERNAME"
                                                        name="USERNAME"
                                                        value={data.USERNAME}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, USERNAME: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.USERNAME ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.USERNAME && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.USERNAME}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="form-group w-100">
                                                <label htmlFor="TELEPHONE" className="label mb-1">
                                                    Téléphone
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <InputText
                                                        type="text"
                                                        id="TELEPHONE"
                                                        name="TELEPHONE"
                                                        value={data.TELEPHONE}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, TELEPHONE: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.TELEPHONE ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.TELEPHONE && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.TELEPHONE}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="form-group w-100">
                                                <label htmlFor="EMAIL" className="label mb-1">
                                                    Email
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <InputText
                                                        type="email"
                                                        id="EMAIL"
                                                        name="EMAIL"
                                                        value={data.EMAIL}
                                                        style={{ borderRadius: "0px" }}
                                                        onChange={e => setData(data => ({ ...data, EMAIL: e.target.value }))}
                                                        className={`w-100 is-invalid ${errors?.EMAIL ? "p-invalid" : ""}`}
                                                    />
                                                    {errors?.EMAIL && <div
                                                        className="invalid-feedback"
                                                        style={{ minHeight: 0, display: "block" }}
                                                    >
                                                        {errors?.EMAIL}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="form-group w-100">
                                                <label htmlFor="sexe" className="label mb-1">Sexe
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
                                                <div className="col-sm">
                                                    <Dropdown
                                                        id="sexe"
                                                        name="sexe"
                                                        value={data.SEXE_ID}
                                                        onChange={(e) => setData(d => ({ ...d, SEXE_ID: e.value }))}
                                                        options={sexes}
                                                        optionLabel="SEXE_DESCRIPTION"
                                                        placeholder="Séléctionner le sexe"
                                                        filter
                                                        style={{ borderRadius: 0 }}
                                                        className="w-full" />
                                                </div>
            
                                                {errors?.SEXE_ID && <div
                                                    className="invalid-feedback"
                                                    style={{ minHeight: 0, display: "block" }}
                                                >
                                                 </div>}
                                            </div>
                                            <div>
                                                <label htmlFor="IMAGE" className="label mb-1">Profile photo
                                                    <span style={{ color: 'red', fontSize: 18 }}>*</span>
                                                </label>
        
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

                                            <center>
                                                <Button
                                                    label="Valider"
                                                    icon="pi pi-sign-in"
                                                    type="submit"
                                                    className="center mt-4 bitwi-button rounded-button"
                                                    size="small"
                                                    loading={isSubmitting}
                                                />
                                            </center>
                                            
                                        </form>
                                    )}
                                    
                                    <div className="text-center mt-3">
                                        {isLoginView ? (
                                            <span>
                                                Vous n'avez pas encore de compte ?{" "}
                                                <a href="#" onClick={() => setIsLoginView(false)} style={{ cursor: "pointer" }}>
                                                    Créer un compte
                                                </a>
                                            </span>
                                        ) : (
                                            <span>
                                                Vous avez déjà un compte ?{" "}
                                                <a href="#" onClick={() => setIsLoginView(true)} style={{ cursor: "pointer" }}>
                                                    Se connecter
                                                </a>
                                            </span>
                                        )
                                        }
                                    </div>
                                    
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;