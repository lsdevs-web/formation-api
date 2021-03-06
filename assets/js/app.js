/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import InvoicesPage from "./Components/Pages/InvoicesPage";
import React, {useState} from 'react';
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
import ReactDOM from 'react-dom';
import Navbar from "./Components/Navbar";
import HomePage from "./Components/Pages/HomePage";
import CustomersPage from "./Components/Pages/CustomersPage";
import CustomerPage from "./Components/Pages/CustomerPage";
import LoginPage from "./Components/Pages/LoginPage";
import AuthApi from "./Services/AuthApi";
import AuthContext from "./Context/AuthContext";
import PrivateRoute from "./Components/PrivateRoute";
import InvoicePage from "./Components/Pages/InvoicePage";
import RegisterPage from "./Components/Pages/RegisterPage";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

require('../css/app.scss');

// Pour rester connecter
AuthApi.setup();


const App = () => {

    const NavBarWithRouter = withRouter(Navbar);

    const [isAuth, setIsAuth] = useState(AuthApi.isAuth());


    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth
        }}>


            <HashRouter>

                <NavBarWithRouter/>

                <main className="container pt-5">

                    <Switch>

                        <Route path="/login" component={LoginPage}/>

                        <Route path="/register" component={RegisterPage}/>

                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>

                        <PrivateRoute path="/customers" component={CustomersPage}/>

                        <PrivateRoute path="/invoices/:id" component={InvoicePage}/>

                        <PrivateRoute path="/invoices" component={InvoicesPage}/>

                        <Route path="/invoices" component={InvoicesPage}/>

                        <Route path="/" component={HomePage}/>

                    </Switch>

                </main>

            </HashRouter>

            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />

        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);
