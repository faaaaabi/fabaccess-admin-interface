import React from "react";
import {Route, Switch} from "react-router-dom";
import ActuatorCreationForm from "./components/ActuatorCreationForm";
import ActorOverview from "./components/ActorOverview";

const Actors: React.FC = () => {

    return (
        <Switch>
            <Route exact={true} path="/actors">
                <ActorOverview/>
            </Route>
            <Route path="/actors/create">
                <ActuatorCreationForm/>
            </Route>
        </Switch>
    );
};

export default Actors;