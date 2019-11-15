import React from "react";
import {Route, Switch} from "react-router-dom";
import ActuatorCreationForm from "./components/ActuatorCreationForm";
import ActuatorOverview from "./components/ActorOverview";

const Actors: React.FC = () => {

    return (
        <Switch>
            <Route exact={true} path="/actuators">
                <ActuatorOverview/>
            </Route>
            <Route path="/actuators/create">
                <ActuatorCreationForm/>
            </Route>
        </Switch>
    );
};

export default Actors;