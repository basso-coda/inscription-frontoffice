import { useEffect, useState } from "react";
import fetchApi from "@/helpers/fetchApi";
import { Skeleton } from "primereact/skeleton";

export default function DocumentsExigesDetails({ documents }) {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTypesDocuments = async () => {
        try {
            const res = await fetchApi("/type_documents");
            setTypes(res.data.rows || []);
        } catch (error) {
            console.error("Erreur de chargement des types de documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypesDocuments();
    }, []);

    const getDocumentByType = (typeId) => {
        return documents.find((doc) => doc.TYPE_DOCUMENT_ID === typeId);
    };

    return (
        <div className="table-responsive">
            {loading ? (
                <Skeleton width="100%" height="200px" />
            ) : (
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Type de document</th>
                            <th>Document fourni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((type) => {
                            const doc = getDocumentByType(type.ID_TYPE_DOCUMENT);
                            return (
                                <tr key={type.ID_TYPE_DOCUMENT}>
                                    <td>{type.DESCRIPTION}</td>
                                    <td>
                                        {doc ? (
                                            <a
                                                href={doc.PATH_DOCUMENT}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Voir le document
                                            </a>
                                        ) : (
                                            <span style={{ color: "red" }}>— Non fourni —</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
