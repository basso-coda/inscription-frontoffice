import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import fetchApi from "@/helpers/fetchApi";
import { useEffect, useState } from "react";
import { auth_routes_items } from "@/routes/auth_routes";
import { useApp } from "@/hooks/useApp";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ChangePasswordPage() {

    const { handleLogout } = useAuth()

    const { setBreadCrumbAction, setToastAction } = useApp()
    const [visibleCurrentPassowrd, setVisibleCurrentPassowrd] = useState(false);
    const [visiblePassowrd, setVisiblePassowrd] = useState(false);
    const [visibleConfirmPassowrd, setVisibleConfirmPassowrd] = useState(false);
    const { state } = useLocation()

    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = {
        ID_UTILISATEUR: state?.ID_utilisateur,
        CURRENT_MOT_DE_PASSE: "",
        MOT_DE_PASSE: "",
        CONFIRM_MOT_DE_PASSE: "",
    }

    const [data, setData] = useState(initialValues)

    const [errors, setErrors] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            setIsSubmitting(true);

            const response = await fetchApi(`/change-password`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setToastAction({
                severity: "success",
                summary: "Success",
                detail: response.message,
                life: 3000,
            })

            setErrors(null);

            handleLogout()

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
        document.title = auth_routes_items.password.name;

        setBreadCrumbAction([auth_routes_items.password])

        return () => {
            setBreadCrumbAction([]);
        };

    }, [])

    return (
        <>
            <div className="px-4 py-3 main_content bg-white has_footer">
                <div className="">
                    <h1 className="mb-3">Changer le mot de passe</h1>
                    <hr className="w-100" />
                </div>
                <form className="form w-75 mt-5" onSubmit={handleSubmit}>
                    <div className="form-group col-sm mt-4 relative">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="CURRENT_MOT_DE_PASSE" className="label mb-1">Ecrire le mot de passe actuel</label>
                            </div>

                            <div className="col-sm">
                                <InputText
                                    required
                                    placeholder="Entrer le mot de passe actuel"
                                    type={visibleCurrentPassowrd ? "text" : "password"}
                                    id="CURRENT_MOT_DE_PASSE"
                                    name="CURRENT_MOT_DE_PASSE"
                                    value={data.CURRENT_MOT_DE_PASSE}
                                    onChange={e => setData(data => ({ ...data, CURRENT_MOT_DE_PASSE: e.target.value }))}
                                    className={`w-100 is-invalid ${errors?.CURRENT_MOT_DE_PASSE ? "p-invalid" : ""}`}

                                />

                                <span
                                    className="p-input-icon-right absolute"
                                    style={{ top: "25px", right: "20px" }}
                                >
                                    {!visibleCurrentPassowrd ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-eye cursor-pointer"
                                            viewBox="0 0 16 16"
                                            onClick={() => setVisibleCurrentPassowrd((b) => !b)}
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
                                            onClick={() => setVisibleCurrentPassowrd((b) => !b)}
                                        >
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                        </svg>
                                    )}
                                </span>

                                {errors?.CURRENT_MOT_DE_PASSE && <div
                                    className="invalid-feedback"
                                    style={{ minHeight: 0, display: "block" }}
                                >
                                    {errors?.CURRENT_MOT_DE_PASSE}
                                </div>}
                            </div>
                        </div>
                    </div>

                    <div className="form-group col-sm mt-4 relative">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="MOT_DE_PASSE" className="label mb-1">Ecrire le nouveau mot de passe</label>
                            </div>

                            <div className="col-sm">
                                <InputText
                                    required
                                    placeholder="Entrer le mot de passe"
                                    type={visiblePassowrd ? "text" : "password"}
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
                    </div>

                    <div className="form-group col-sm mt-4 relative">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="CONFIRM_MOT_DE_PASSE" className="label mb-1">Confirmer le nouveau mot de passe</label>
                            </div>

                            <div className="col-sm">
                                <InputText
                                    required
                                    placeholder="Confirmer le mot de passe"
                                    type={visibleConfirmPassowrd ? "text" : "password"}
                                    id="CONFIRM_MOT_DE_PASSE"
                                    name="CONFIRM_MOT_DE_PASSE"
                                    value={data.CONFIRM_MOT_DE_PASSE}
                                    onChange={e => setData(data => ({ ...data, CONFIRM_MOT_DE_PASSE: e.target.value }))}
                                    className={`w-100 is-invalid ${errors?.CONFIRM_MOT_DE_PASSE ? "p-invalid" : ""}`}

                                />

                                <span
                                    className="p-input-icon-right absolute"
                                    style={{ top: "25px", right: "20px" }}
                                >
                                    {!visibleConfirmPassowrd ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-eye cursor-pointer"
                                            viewBox="0 0 16 16"
                                            onClick={() => setVisibleConfirmPassowrd((b) => !b)}
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
                                            onClick={() => setVisibleConfirmPassowrd((b) => !b)}
                                        >
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                        </svg>
                                    )}
                                </span>

                                {errors?.CONFIRM_MOT_DE_PASSE && <div
                                    className="invalid-feedback"
                                    style={{ minHeight: 0, display: "block" }}
                                >
                                    {errors?.CONFIRM_MOT_DE_PASSE}
                                </div>}
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="w-100 d-flex justify-content-end shadow-4 pb-3 pr-5 bg-white">
                        <Button label="Reinitialiser" type="reset" outlined className="mt-3" size="small" onClick={e => {
                            e.preventDefault()
                            setData(initialValues)
                            setErrors(null)
                        }} />

                        <Button label="Envoyer" type="submit" className="mt-3 ml-3" size="small" disabled={isSubmitting} loading={isSubmitting} />
                    </div>
                </form>
            </div>
        </>
    )
}