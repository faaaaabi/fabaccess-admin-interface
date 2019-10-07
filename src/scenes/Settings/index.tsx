import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Settings: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Einstellungen';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Einstellungen - Content
        </div>
    );
};

export default Settings;