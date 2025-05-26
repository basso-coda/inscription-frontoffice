import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useApp } from "@/hooks/useApp";
import fetchApi from "@/helpers/fetchApi";
import { Dialog } from "primereact/dialog";

export default function NewProfilModal(props) {
  const { setToastAction } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    ID_PROFIL: props.data?.ID_PROFIL,
    DESCRIPTION: props.data?.DESCRIPTION ?? "",
  };

  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setIsSubmitting(true);

      const url = `/profils${data.ID_PROFIL ? `/${data.ID_PROFIL}` : ''}`

      const response = await fetchApi(url, {
        method: data.ID_PROFIL ? 'PUT' : 'POST',
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

      props.setVisible(false);

      setErrors(null);

      props.fetchProfils();

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

  return (
    <Dialog
      header={props.data ? `Modifier le profil` : `Nouveau profil`}
      visible={props.visible}
      position="center"
      style={{ width: "50vw" }}
      onHide={() => {
        props.setVisible(!props.visible);
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-column gap-2">
        <div className="row">
          {/* <div className="col-md-12">
            <label htmlFor="price" className="label mb-1">
              Nom
              <span style={{ color: "red" }}>*</span>
            </label>
            <InputText
              disabled
              type="text"
              id="PROFIL_NOM"
              name="PROFIL_NOM"
              style={{ borderRadius: "0px" }}
              value={data.PROFIL_NOM}
              placeholder=""
              className={`w-100 is-invalid ${errors?.PROFIL_NOM ? "p-invalid" : ""
                }`}
              onChange={(e) => setData(d => ({ ...d, "PROFIL_NOM": e.target.value }))}
            />
            <div
              className="invalid-feedback"
              style={{ minHeight: 10, display: "block" }}
            >
              {errors?.PROFIL_NOM ? errors?.PROFIL_NOM : ""}
            </div>
          </div> */}

          <div className="col-md-12">
            <label htmlFor="price" className="label mb-1">
              Description
            </label>
            <InputText
              type="text"
              id="DESCRIPTION"
              name="DESCRIPTION"
              style={{ borderRadius: "0px" }}
              value={data.DESCRIPTION}
              placeholder=""
              className={`w-100 is-invalid ${errors?.DESCRIPTION
                ? "p-invalid"
                : ""
                }`}
              onChange={(e) => setData(d => ({ ...d, DESCRIPTION: e.target.value }))}
            />
            <div
              className="invalid-feedback"
              style={{ minHeight: 10, display: "block" }}
            >
            </div>
          </div>
        </div>

        <div className="w-100 d-flex justify-content-end  pb-1 bg-white">

          <Button
            label={'Enregistrer'}
            type="submit"
            icon={isSubmitting ? `pi pi-spin pi-spinner` : `pi pi-save`}
            className="bitwi-button"
            size="small"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
}
