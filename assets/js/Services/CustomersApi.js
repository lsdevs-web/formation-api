import Axios from "axios";

async function findAll() {

    return Axios
        .get("https://localhost:8000/api/customers")
        .then(response => response.data['hydra:member']);
}

function delCustomer(id) {
    return Axios
        .delete("https://localhost:8000/api/customers/" + id)

}

export default {
    findAll,
    delete: delCustomer
};

