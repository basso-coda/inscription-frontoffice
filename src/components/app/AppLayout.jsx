import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";
import Footer from "./Footer"

export const AppLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100" style={{ width: '100%' }}>
            {/* Header */}
            <Header />

            {/* Contenu principal */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}
