export type Actuator = {
    id: string,
    name: string,
    type: 'switch' | 'messageDriven'
    system: 'openHAB',
    status: 'online' | 'offline' | 'unknown'
};

export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}