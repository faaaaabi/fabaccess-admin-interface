import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Permissions: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Berechtigungen';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Berechtigungen - Content
        </div>
    );
};

export default Permissions;