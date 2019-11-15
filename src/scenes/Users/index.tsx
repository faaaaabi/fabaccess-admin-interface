import React from "react";
import {Route, Switch} from "react-router-dom";
import UserOverview from "./components/UserOverview";
import UserForm from "./components/UserForm";

const Users: React.FC = () => {

    return (
        <Switch>
            <Route exact={true} path="/users">
                <UserOverview/>
            </Route>
            <Route path="/users/create">
                <UserForm/>
            </Route>
            <Route path="/users/:id">
                <UserForm/>
            </Route>
        </Switch>
    );
};

export default Users;
