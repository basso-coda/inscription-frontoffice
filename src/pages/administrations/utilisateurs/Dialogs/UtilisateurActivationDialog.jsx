import fetchApi from "@/helpers/fetchApi";
import { useApp } from "@/hooks/useApp";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import * as yup from "yup";

yup.setLocale({
    mixed: {
        required: 'Ce champ est obligatoire'
    }
})

const schema = yup.object().shape({
    ID_UTILISATEUR: yup.number().required(),
    ID_PROFIL: yup.number().required(),
    IS_ACTIVE: yup.number().oneOf([0, 1]),
    COMMENTAIRE: yup.string().required(),
});

const UtilisateurActivationDialog = (props) => {
    const { setToastAction } = useApp()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialForm = {
        ID_UTILISATEUR: props.data?.ID_UTILISATEUR,
        IS_ACTIVE: props.data?.IS_ACTIVE,
        ID_PROFIL: props.data.profil.ID_PROFIL,
        COMMENTAIRE: '',
    }

    const [data, setData] = useState(initialForm)
    const [errors, setErrors] = useState({})

    const handleSubmit = async (e) => {
        try {

            e.preventDefault()

            setIsSubmitting(true)

            schema.validate(data, { abortEarly: false })
                .catch(error => {
                    console.log(error)

                    setToastAction({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur de validation des données',
                        life: 3000
                    });

                    setErrors(error.inner.reduce((acc, curr) => {
                        if (curr.path) {
                            return { ...acc, [curr.path]: curr.errors[0] }
                        }
                    }, {}))
                })

            let isValidate = await schema.isValid(data)

            if (isValidate) {

                const res = await fetchApi('/utilisateurs/delete', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' }
                })

                setToastAction({
                    severity: 'success',
                    summary: 'Succès',
                    detail: res.message,
                    life: 3000
                })

                props.onHide();
                setData(initialForm);
                setErrors({});
                props.fetchUtilisateurs()
            }

        } catch (error) {
            console.log(error)
            if (error.httpStatus === 422) {
                setErrors(error.errors)
            }

            setToastAction({
                severity: 'error',
                summary: 'Erreur',
                detail: error.message,
                life: 3000
            });
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            header={`${data.IS_ACTIVE ? 'Désactivation' : 'Activation'} d'un utilisateur`}
            visible={props.visible}
            style={{ width: "35vw" }}
            onHide={props.onHide}
        >
            <form onSubmit={handleSubmit} className="flex flex-column gap-2">
                <div className="row">

                    <div className="mb-2">
                        <div key="comment" className="col-md-12">
                            <label htmlFor="comment" className="label mb-3">
                                Commentaire
                            </label>
                            <span style={{ color: 'red', fontSize: 18 }}>*</span>
                        </div>

                        <InputTextarea
                            inputid="COMMENTAIRE"
                            name="COMMENTAIRE"
                            style={{ width: "100%", borderRadius: "0px" }}
                            rows={4}
                            cols={30}
                            placeholder={`Commentaire`}
                            className={`w-100 ${errors?.COMMENTAIRE ? 'p-invalid' : ''}`}
                            value={data.COMMENTAIRE}
                            onChange={(e) => setData(data => ({ ...data, COMMENTAIRE: e.target.value }))}
                        />

                        {errors?.COMMENTAIRE && <div className="invalid-feedback" style={{ minHeight: 21, display: 'block' }}>
                            {errors.COMMENTAIRE}
                        </div>}
                    </div>

                </div>

                <div className="w-100 d-flex justify-content-end pb-1 pr-1 bg-white">
                    <Button
                        icon={isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-check-circle`}
                        label={'Continuer'}
                        style={{ borderRadius: "0px" }}
                        type="submit"
                        disabled={isSubmitting}
                        className="ml-33 bitwi-button"
                        size="small"
                    />
                </div>
            </form>
        </Dialog>
    );
};

export default UtilisateurActivationDialog;