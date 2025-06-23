export default function PersonnesContactDetails({ personnes = [] }) {
    return (
        <div>
            {personnes.length === 0 ? (
                <p>Aucune personne de contact renseignée.</p>
            ) : (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Lien de parenté</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Adresse</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personnes.map((p) => (
                            <tr key={p.ID_PERSONNE_CONTACT}>
                                <td>{p.NOM}</td>
                                <td>{p.PRENOM}</td>
                                <td>{p.LIEN_PARENTE}</td>
                                <td>{p.NUMERO_TELEPHONE}</td>
                                <td>{p.EMAIL || <i style={{ color: 'gray' }}>Non renseigné</i>}</td>
                                <td>{p.ADRESSE_RESIDENCE}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
