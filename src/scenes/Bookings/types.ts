import {Machine} from '../Machines/types';
import {User} from "../Users/types";

export type Booking = {
    id: string
    startedAt: number
    machineName: string
    userName: string
};

export type ConfirmationDialogState = {
    heading: string
    confirmationText: string
    agreeAction: Function
    disagreeAction: Function
}