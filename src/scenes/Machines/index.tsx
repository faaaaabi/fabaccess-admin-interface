import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {Typography} from "@material-ui/core";

const Machines: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Maschinen';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            <Typography>
                Imanigationshilfe: Hier könntest du folgendes tun
                <ul>
                    <li>Maschine anlegen</li>
                    <li>Notwendige Berechtigungen für die Benutzung dieser Maschine auswählen</li>
                    <li>Hinweise für die Inbetrieb- und Außerbetriebnahme anlegen</li>
                    <li>Maschine mit einem Aktor (Steckdose) verbinden.</li>
                </ul>
            </Typography>
        </div>
    );
};

export default Machines;