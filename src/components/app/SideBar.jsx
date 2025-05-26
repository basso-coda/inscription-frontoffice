import { useApp } from "@/hooks/useApp";
import "../../styles/app/sidebar.css";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { FormattedMessage } from "react-intl";
import Logo from "../../assets/biu-logo.jpg";

export default function SideBar() {
  const { setToastAction } = useApp();
  const { handleLogout, user } = useAuth();

  const toggleSubMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.toggle("collapse-show");
  };

  const onLogout = (e) => {
    e.stopPropagation();
    e.preventDefault();

    handleLogout();

    setToastAction({
      severity: "success",
      summary: "Success",
      detail: "Utilisateur déconnecté avec succés",
      life: 3000,
    })
  }

  return (
    <aside className="sidebar d-flex flex-column justify-content-between shadow z-1">
      <Link
        to={"/dashboard"}
        className="d-flex align-items-center px-3 py-2 text-decoration-none link-dark"
      >
        <img
          src={Logo}
          alt=""
          className="logo w-3 h-3"

        />
        {/* <img src={'/vite.svg?url'} alt="" className="logo" /> */}
        <h6 className="mx-2 mb-0">ONLINE - INSCRIPTION</h6>
      </Link>

    </aside>
  );
}