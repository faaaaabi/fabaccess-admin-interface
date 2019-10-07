import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Bookings: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Buchungen';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Buchungen - Content
        </div>
    );
};

export default Bookings;