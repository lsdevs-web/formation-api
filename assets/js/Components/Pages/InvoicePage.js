import React, {useEffect, useState} from 'react';
import Field from "../Forms/Field";
import Select from "../Forms/Select";
import {Link} from "react-router-dom";
import CustomersApi from "../../Services/CustomersApi";
import Axios from "axios";

const InvoicePage = (props) => {

    const {id = "new"} = props.match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    const [editing, setEditing] = useState(false);

    const fetchCustomers = async () => {
        try {

            const data = await CustomersApi.findAll();
            setCustomers(data);

            if (!invoice.customer) {
                setInvoice({...invoice, customer: data[0].id});
            }


        } catch (e) {

            props.history.replace("/invoices")

        }

    };

    const fetchInvoice = async id => {
        try {

            const data = await Axios.get("https://localhost:8000/api/invoices/" + id)
                .then(response => response.data);

            const {amount, status, customer} = data;

            setInvoice({amount, status, customer: customer.id});

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {

        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }

    }, [id]);


    const handleChange = ({target}) => {
        const {name, value} = target;
        setInvoice({...invoice, [name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {

            if (editing) {

                const response = await Axios.put("https://localhost:8000/api/invoices/" + id, {
                    ...invoice,
                    customer: `/api/customers/${invoice.customer}`
                })

            } else {

                const response = await Axios.post("https://localhost:8000/api/invoices",
                    {...invoice, customer: `/api/customers/${invoice.customer}`}
                );
                props.history.replace("/invoices");
            }

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
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}

            <form onSubmit={handleSubmit}>

                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la facture"
                    label="Montant"
                    value={invoice.amount}
                    onChange={handleChange}
                    error={errors.amount}
                />

                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer}
                        onChange={handleChange}>

                    {customers.map(customer => (
                        <option
                            value={customer.id}
                            key={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}


                </Select>

                <Select name="status" label="Statut" error={errors.status} value={invoice.status}
                        onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures </Link>
                </div>

            </form>

        </>
    );
};

export default InvoicePage;
