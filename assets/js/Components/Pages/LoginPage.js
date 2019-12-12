import React, {useContext, useState} from 'react';
import AuthApi from "../../Services/AuthApi";
import AuthContext from "../../Context/AuthContext";

const LoginPage = (props) => {

    const {setIsAuth} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");


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
            props.history.replace("/customers");
        } catch (e) {

            setError("Informations incorrects")
        }


    };


    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">

                    <label htmlFor="username">Adresse email</label>

                    <input type="email"
                           value={credentials.username}
                           onChange={handleChange}
                           placeholder="Adresse email de connexion"
                           className={"form-control " + (error && "is-invalid")}
                           id="username"
                           name="username"
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>


                <div className="form-group">

                    <label htmlFor="password">Mot de passe</label>

                    <input type="password"
                           onChange={handleChange}
                           value={credentials.password}
                           placeholder="Mot de passe"
                           name="password"
                           id="password"
                           className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>

        </>
    );
};

export default LoginPage;
