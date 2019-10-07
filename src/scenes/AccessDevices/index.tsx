import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const AccessDevices: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Zugriffsgeräte';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Zugriffsgeräte - Content
        </div>
    );
};

export default AccessDevices;