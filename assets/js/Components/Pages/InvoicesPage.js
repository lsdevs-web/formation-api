import React, {useEffect, useState} from 'react';
import Pagination from "../Pagination";
import Moment from 'moment'
import InvoicesApi from "../../Services/InvoicesApi";


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


    // Récupération des invoices au près de l'API
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll();
            setInvoices(data);
        } catch (e) {
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
            console.log("ok")

        } catch (e) {
            console.log(e.response);
            // S'il y a une erreur on remet à jour nos invoices avec les originaux que l'on avait copié
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
            <h1>Liste des factures</h1>
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
                <tbody>
                {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td><a href="">{invoice.customer.firstName}</a></td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge badge-" + statusClasses[invoice.status] + " text-center"}>
                            {statusLabels[invoice.status]}
                        </span>
                    </td>
                    <td className={"text-center"}>{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <button className="btn btn-sm btn-primary mr-1">Editer</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer
                        </button>
                    </td>
                </tr>)}

                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
                        length={filteredInvoices.length}/>
        </>
    );
};

export default InvoicesPage;
