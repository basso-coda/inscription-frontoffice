export default function ChoixAcademiqueDetails(props) {
    
    return <table className="table table-hover table-striped">
        <tbody>
            <tr>
                <th> {`Année académique`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.ANNEE_ACADEMIQUE}
                </td>
            </tr>

            <tr>
                <th> {`Faculté`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.classe?.departement?.faculte?.DESCRIPTION}
                </td>
            </tr>

            <tr>
                <th> {`Département`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.classe?.departement?.DESCRIPTION}
                </td>
            </tr>

            <tr>
                <th> {`Classe`}</th>
                <td colSpan="2" style={{ textTransform: "capitalize" }}>
                    {props.data?.classe?.DESCRIPTION}
                </td>
            </tr>

        </tbody>
    </table>
}