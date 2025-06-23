export default function EtudesAnterieuresDetails(props) {
    
    return <table className="table table-hover table-striped">
        <tbody>
            <tr>
                <th> {`Dernière école fréquentée`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.NOM_DERNIERE_ECOLE_FREQUENTEE}
                </td>
            </tr>

            <tr>
                <th> {`Note de la dernière école secondaire`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.NOTE_DERNIERE_ECOLE_SECONDAIRE_FREQUENTEE}
                </td>
            </tr>

            <tr>
                <th> {`Note à l’examen d’État`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.NOTE_EXAMEN_D_ETAT}
                </td>
            </tr>

        </tbody>
    </table>
}