export type Place = {
    id: string,
    name: string,
    description: string,
    assignedMachineIds: string[]
};


export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}