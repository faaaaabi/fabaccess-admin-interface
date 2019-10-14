export type AccessDevice = {
    id: string,
    name: string,
    apiKey: string
};

export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}