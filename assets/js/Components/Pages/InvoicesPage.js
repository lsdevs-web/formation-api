import React, {useEffect, useState} from 'react';
import Pagination from "../Pagination";
import Moment from 'moment'
import InvoicesApi from "../../Services/InvoicesApi";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../Loaders/TableLoader";


const statusClasses = {
    PAYED: "success",
    SENT: "primary",
    CANCELED: "danger"
};

const statusLabels = {
    PAYED: "Payée",
    SENT: "Envoyée",
    CANCELED: "Annulée"
};


const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    // Récupération des invoices au près de l'API
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (e) {
            toast.error("Erreur lors du chargement des factures");
            console.log(e.response)
        }
    };


    // Charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion du changement de page
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gestion de la recherche
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);
        setCurrentPage(1);
    };

    // Gestion de la supprésion d'une invoice ASYNC
    const handleDelete = async id => {
        // D'abord on copie les invoices actuelles
        const orignalInvoices = [...invoices];

        // Ensuite on filtre toutes les invoices pour retirer celle qui à notre id
        setInvoices(invoices.filter(invoice => invoice.id !== id));


        try {
            // On attend la reponse de la suppression
            await InvoicesApi.delete(id);
            toast.success("La facture à été supprimée");

        } catch (e) {
            console.log(e.response);
            // S'il y a une erreur on remet à jour nos invoices avec les originaux que l'on avait copié
            toast.error("Un erreur est survenue");
            setInvoices(orignalInvoices);
        }
    };


    const itemsPerPage = 10;

    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            statusLabels[i.status].toLowerCase().includes(search.toLowerCase())
    );

    const paginatedInvoices = Pagination.getDate(filteredInvoices, currentPage, itemsPerPage);


    // Gestion du format de date avec Moment.js
    const formatDate = (str) => {
        return Moment(str).format('DD/MM/YYYY');
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder={"Rechercher"}/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Chrono</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoie</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
                </thead>
                {!loading && <tbody>
                {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td><Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName}</Link></td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-" + statusClasses[invoice.status] + " text-center"}>
                            {statusLabels[invoice.status]}
                        </span>
                    </td>
                    <td className={"text-center"}>{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <Link className="btn btn-sm btn-primary mr-1" to={"/invoices/" +invoice.id}>Editer</Link>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer
                        </button>
                    </td>
                </tr>)}

                </tbody>}
            </table>

            {loading && <TableLoader/>}

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
                        length={filteredInvoices.length}/>
        </>
    );
};

export default InvoicesPage;
