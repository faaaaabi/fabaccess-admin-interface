export type Actor = {
    id: string,
    name: string,
    system: 'openHAB',
    status: 'online' | 'offline' | 'unknown'
};

export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}