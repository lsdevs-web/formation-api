import Axios from "axios";

function findAll() {
    return Axios
        .get("https://localhost:8000/api/invoices")
        .then(response => response.data['hydra:member'])
}

function delInvoice(id) {
    return Axios
        .delete("https://localhost:8000/api/invoices/" + id)

}

export default {
    findAll,
    delete: delInvoice
};

