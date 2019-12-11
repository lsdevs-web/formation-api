/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import InvoicesPage from "./Components/Pages/InvoicesPage";
import React from 'react';
import {HashRouter, Route, Switch} from "react-router-dom";
import ReactDOM from 'react-dom';
import Navbar from "./Components/Navbar";
import HomePage from "./Components/Pages/HomePage";
import CustomerPage from "./Components/Pages/CustomerPage";

require('../css/app.scss');


const App = () => {
    return <HashRouter>
        <Navbar/>
        <main className="container pt-5">
            <Switch>
                <Route path="/customers" component={CustomerPage}/>
                <Route path="/invoices" component={InvoicesPage}/>
                <Route path="/" component={HomePage}/>
            </Switch>
        </main>
    </HashRouter>
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App/>, rootElement);
