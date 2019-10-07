import {SET_PAGE_TITLE, SetPageTitleAction} from "./types";

export const setPageTitle = (newPageTitle: String): SetPageTitleAction => {
    return {
        type: SET_PAGE_TITLE,
        payload: newPageTitle
    }
};