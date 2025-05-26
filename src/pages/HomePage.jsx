import { Button } from "primereact/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();

    useEffect(() => { document.title = 'Dashboard' }, [])

    return <section className="d-flex align-items-center min-vh-100 py-5">
        <div className="container py-5">
            <div className="row align-items-center">
                <div className="text-center text-md-start ">
                    <div className="lc-block mb-3">
                        <div editable="rich">
                            <h1 className="fw-bold h4">Page d'accueil!</h1>
                        </div>
                    </div>
                    <div className="lc-block mb-3">
                        <div editable="rich" className="mb-3">
                            Page public qui ne necessite pas l'authentification.
                        </div>
                        <Button
                            label="Se connecter"
                            icon="pi pi-plus"
                            size="small"
                            onClick={() => {
                                navigate("/");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
}

export default Homepage;