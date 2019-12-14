import React, {useEffect, useState} from 'react';
import Pagination from "../Pagination";
import CustomersApi from "../../Services/CustomersApi";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../Loaders/TableLoader";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    // Permet de récupérer les customers
    const fetchCustomer = async () => {
        try {
            const data = await CustomersApi.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (e) {
            toast.error("Un erreur est survenue");
            console.log(e.response);
        }
    };

    // Au chargement du composant on va chercher les customers
    useEffect(() => {
        fetchCustomer();
    }, []);


    // Gestion de la suppression d'un client
    const handleDelete = async (id) => {

        const originaleCustomer = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await CustomersApi.delete(id)
            toast.success("Client supprimé");

        } catch (e) {
            setCustomers(originaleCustomer);
            toast.error("La suppréssion du client à échouée");
            console.log(e.response);
        }
    };

    // Gestion du changement de page
    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    // Gestion de la recherche
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);
        setCurrentPage(1);
    };


    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomer = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getDate(filteredCustomer, currentPage, itemsPerPage);


    return (
        <>

            <div className="d-flex justify-content-between align-items-center">

                <h1>Liste des clients</h1>
                <Link className="btn btn-primary" to="/customers/new">Création d'un client</Link>
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder={"Rechercher"}/>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>

                {!loading && <tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/" + customer.id}>{customer.lastName} {customer.firstName}</Link>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                        <span className="badge badge-primary">
                            {customer.invoices.length}
                        </span>
                        </td>
                        <td className="text-center">
                            {customer.totalAmount.toLocaleString()} €
                        </td>
                        <td>
                            <button disabled={customer.invoices.length > 0}
                                    onClick={() => handleDelete(customer.id)}
                                    className="btn btn-sm btn-danger">Supprimer
                            </button>
                        </td>
                    </tr>)}

                </tbody>}
            </table>

            {loading && <TableLoader/>}

            {itemsPerPage < filteredCustomer.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomer.length}
                    onPageChanged={handleChangePage}
                />
            )}
        </>
    );
};

export default CustomersPage;
