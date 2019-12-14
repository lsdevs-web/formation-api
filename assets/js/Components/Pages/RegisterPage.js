import React, {useState} from 'react';
import Field from "../Forms/Field";
import {Link} from "react-router-dom";
import Axios from "axios";

const RegisterPage = (props) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({target}) => {
        const {name, value} = target;
        setUser({...user, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const ApiErrors = {};

        if (user.password !== user.passwordConfirm) {
            ApiErrors.passwordConfirm = "Vos mots de passe ne correspondent pas";
            setErrors(ApiErrors);

            return;
        }


        try {

            const response = await Axios.post("https://localhost:8000/api/users", user);
            setErrors({});
            props.history.replace("/login");
        } catch (e) {

            const {violations} = e.response.data;

            if (violations) {

                violations.forEach(violation => {
                    ApiErrors[violation.propertyPath] = violation.message;
                });

                setErrors(ApiErrors);
            }
        }

    };


    return (
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>

                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                    type="email"
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                    type="password"
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    type="password"
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>

            </form>

        </>
    );
};

export default RegisterPage;
