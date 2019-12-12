import React, {useContext} from 'react';
import AuthContext from "../Context/AuthContext";
import {Redirect, Route} from "react-router-dom";

const PrivateRoute = props => {

    const {isAuth} = useContext(AuthContext);

    return isAuth
        ? (<Route path={props.path} component={props.component}/>)

        : (<Redirect to="/login"/>);
};

export default PrivateRoute;
