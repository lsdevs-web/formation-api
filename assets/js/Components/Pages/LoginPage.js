import React, {useContext, useState} from 'react';
import AuthApi from "../../Services/AuthApi";
import AuthContext from "../../Context/AuthContext";
import Field from "../Forms/Field";
import {toast} from "react-toastify";

const LoginPage = (props) => {

    const {setIsAuth} = useContext(AuthContext);
    const [error, setError] = useState("");


    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });


    // Gestion des champs
    const handleChange = event => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]: value})
    };


    // Gestion du submit
    const handleSubmit = async event => {

        event.preventDefault();

        try {
            await AuthApi.authenticate(credentials);
            setError("");
            setIsAuth(true);
            toast.success("Vous êtes connecté");
            props.history.replace("/customers");
        } catch (e) {

            setError("Informations incorrects");
            toast.error("Un erreur est survenue");
        }


    };


    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>

                <Field label="Adresse email"
                       name="username"
                       value={credentials.username}
                       onChange={handleChange}
                       placeholder="Adresse email"
                       error={error}
                       type="email"
                />

                <Field label="Mot de passe"
                       name="password"
                       value={credentials.password}
                       onChange={handleChange}
                       placeholder="Votre mot de passe"
                       type="password"
                />


                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>

        </>
    );
};

export default LoginPage;
