import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Places: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Orte';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Orte - Content
        </div>
    );
};

export default Places;