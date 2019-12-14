import React, {useContext} from 'react';
import AuthApi from "../Services/AuthApi";
import {NavLink} from "react-router-dom";
import AuthContext from "../Context/AuthContext";
import {toast} from "react-toastify";

const Navbar = (props) => {

    const {isAuth, setIsAuth} = useContext(AuthContext);

    const handleLogout = () => {
        AuthApi.logout();
        setIsAuth(false);
        toast.info("Vous êtes déconnecté");
        props.history.push("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

            <NavLink className="navbar-brand" to="/">SymReact</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                    aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon">

                </span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink to="/customers" className="nav-link" href="#">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/invoices" className="nav-link" href="#">Factures</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">

                    {!isAuth &&
                    <>
                        <li className="nav-item"><NavLink to="register" className="nav-link">Inscription</NavLink></li>
                        <li className="nav-item"><NavLink to="/login" className="btn btn-success">Connexion</NavLink>
                        </li>
                    </> ||
                    <li className="nav-item">
                        <button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
                    </li>}


                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
