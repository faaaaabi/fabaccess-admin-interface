import React from "react";
import {Route, Switch} from "react-router-dom";
import ActorOverview from "./components/PlacesOverview";
import PlacesForm from "./components/PlacesForm";

const Actors: React.FC = () => {

    return (
        <Switch>
            <Route exact={true} path="/places">
                <ActorOverview/>
            </Route>
            <Route path="/places/create">
                <PlacesForm/>
            </Route>
            <Route path="/places/edit/:id">
                <PlacesForm/>
            </Route>
        </Switch>
    );
};

export default Actors;