import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Actors: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Aktoren';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Aktoren - Content
        </div>
    );
};

export default Actors;