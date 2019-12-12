import Axios from "axios";
import jwtDecode from 'jwt-decode';

/**
 * Requête HTTP d'authentification et stockage du Token dans le storage et sur Axios
 *
 * @param credentials
 * @returns {Promise}
 */
function authenticate(credentials) {
    // On récupère le token avec la requête
    return Axios.post("https://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {

            // On stock dans le localStorage
            window.localStorage.setItem("Token", token.toString());

            // On prévient Axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes HTTP
            Axios.defaults.headers["Authorization"] = "Bearer " + token;

            console.log("Connecté");

        });
}

/**
 * Déconnexion (suppression du Token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("Token");
    delete Axios.defaults.headers['Authorization'];

}

/**
 * Mise en place lors du chargement de l'application
 */
// Voir si on a un Token, si le Token est encore valide [yarn add jwt-decode]
function setup() {
    // On récupère le token
    const token = window.localStorage.getItem("Token");

    if (token) {
        const jwtData = jwtDecode(token);
        // Timstamps = secondes
        // getTime = millisecondes
        // Donc soit getTime / 1000 soit exp * 1000
        if (jwtData.exp * 1000 > new Date().getTime()) {

            Axios.defaults.headers["Authorization"] = "Bearer " + token;

        } else {
            logout();
        }

    } else {
        logout();
    }

}

/**
 * Permet de savoir si on est authentifié ou pas
 *
 * @returns {boolean}
 */
// Voir App.js pour la navbar
function isAuth() {

    // On récupère le token
    const token = window.localStorage.getItem("Token");

    if (token) {
        const jwtData = jwtDecode(token);
        // Timstamps = secondes
        // getTime = millisecondes
        // Donc soit getTime / 1000 soit exp * 1000
        return jwtData.exp * 1000 > new Date().getTime();
    }
    return false

}

export default {
    authenticate,
    logout,
    setup,
    isAuth
}
