import React, {useEffect, useState} from 'react';
import Field from "../Forms/Field";
import {Link} from "react-router-dom";
import Axios from "axios";

const CustomerPage = (props) => {


    // On chope l'id dans l'url (si pas d'id alors = new)
    const {id = "new"} = props.match.params;


    // Un state pour le customer = un objet avec des propriétés
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    // Un state pour les erreurs = le même que le customer car ce sera sur les mêmes propriétés
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    // Modifier ou créer ?
    const [editing, setEditing] = useState(false);

    // Requête http async await
    const fetchCustomer = async id => {

        try {
            const data = await Axios
                .get("https://localhost:8000/api/customers/" + id)
                .then(response => response.data);

            // On extrait de data les données que l'on veut
            const {firstName, lastName, email, company} = data;

            // On met notre state à jour avec les données reçu
            setCustomer({firstName, lastName, email, company});

        } catch (e) {
            console.log(e.reponse)
        }
    };

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    const handleChange = ({target}) => {
        const {name, value} = target;

        setCustomer({...customer, [name]: value});
    };

    const handleSubmit = async event => {

        event.preventDefault();


        try {

            if (editing) {
                const response = await Axios
                    .put("https://localhost:8000/api/customers/" + id, customer);
            } else {
                const response = await Axios.post("https://localhost:8000/api/customers", customer);
                props.history.replace("/customers");
            }

            setErrors({});

        } catch (e) {

            if (e.response.data.violations) {

                const ApiErrors = {};
                e.response.data.violations.forEach(violation => {
                    ApiErrors[violation.propertyPath] = violation.message;
                });

                setErrors(ApiErrors);
            }

        }

    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}


            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />


                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>

            </form>

        </>
    );
};

export default CustomerPage;
