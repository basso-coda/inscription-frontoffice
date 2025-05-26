export default function Footer() {
    return (
        <footer className="bg-light py-4 border-top mt-auto">
            <div className="container text-center">
                <p className="mb-1 fw-bold">Bujumbura International University</p>
                <p className="mb-1 text-muted">Plateforme d'admission en ligne - monDossier</p>
                <small className="text-muted">© {new Date().getFullYear()} Tous droits réservés.</small>
            </div>
        </footer>
    );
};
