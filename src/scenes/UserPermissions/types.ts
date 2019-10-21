export type UserPermission = {
    id: string,
    name: string,
    description: string
};

export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}