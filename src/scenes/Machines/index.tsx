import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";

const Machines: React.FC = () => {

    const dispatch = useDispatch();
    const pageTitle = 'Maschinen';

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    return (
        <div>
            Maschinen - Content
        </div>
    );
};

export default Machines;