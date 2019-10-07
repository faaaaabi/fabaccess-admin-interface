import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Users: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Benutzer';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Benutzer - Content
        </div>
    );
};

export default Users;