export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';

export type SetPageTitleAction = {
    type: typeof SET_PAGE_TITLE
    payload: String;
}

export type NavigationState = {
    pageTitle: String;
}

export type NavigationActions = SetPageTitleAction;

