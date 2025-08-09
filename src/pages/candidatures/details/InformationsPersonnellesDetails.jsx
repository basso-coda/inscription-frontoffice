import { formatDate } from "@/helpers/formatter";

export default function InformationsPersonnellesDetails(props) {
    
    return <table className="table table-hover table-striped">
        <tbody>
            <tr>
                <th> {`Nom`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.NOM}
                </td>
            </tr>

            <tr>
                <th> {`Prénom`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.PRENOM}
                </td>
            </tr>

            <tr>
                <th> {`Email privé`}</th>
                <td colSpan="2">
                    {props.data?.EMAIL_PRIVE}
                </td>
            </tr>

            <tr>
                <th> {`Téléphone privé`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.NUMERO_TELEPHONE_PRIVE}
                </td>
            </tr>

            <tr>
                <th> {`Date de naissance`}</th>
                <td colSpan="3">{props.data?.DATE_NAISSANCE ? formatDate(new Date(props.data?.DATE_NAISSANCE)) : '-'}</td>
            </tr>

            <tr>
                <th> {`Sexe`}</th>
                <td colSpan="3">{props.data?.sexe?.SEXE_DESCRIPTION}</td>
            </tr>

            <tr>
                <th> {`Etat civil`}</th>
                <td colSpan="3">
                    {props.data?.etat_civil?.DESCRIPTION}
                </td>
            </tr>

            <tr>
                <th> {`Nationalité`}</th>
                <td colSpan="3">
                    {props.data?.nationalite?.NOM_NATIONALITE}
                </td>
            </tr>

            <tr>
                <th> {`Numéro carte d'identité`}</th>
                <td colSpan="3">
                    {props.data?.NUM_CARTE_IDENTITE}
                </td>
            </tr>

            <tr>
                <th> {`Date de délivrance`}</th>
                <td colSpan="3">{props.data?.DATE_DELIVRANCE ? formatDate(new Date(props.data?.DATE_DELIVRANCE)) : '-'}</td>
            </tr>

            <tr>
                <th> {`Adresse de résidence`}</th>
                <td colSpan="3">
                    {props.data?.ADRESSE_RESIDENCE}
                </td>
            </tr>

        </tbody>
    </table>
}