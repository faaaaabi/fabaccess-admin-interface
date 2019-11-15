import {NavigationState, NavigationActions} from "./types";

const initialState: NavigationState = {
    pageTitle: ''
};

const navigationReducer = (state = initialState, action : NavigationActions) : NavigationState => {
    switch (action.type) {
        case "SET_PAGE_TITLE":
            return {
                pageTitle: action.payload
            };
        default:
            return state;
    }
};

export default navigationReducer;