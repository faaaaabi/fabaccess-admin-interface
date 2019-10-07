import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Dashboard: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Dashboard';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Dashboard - Content
        </div>
    );
};

export default Dashboard;