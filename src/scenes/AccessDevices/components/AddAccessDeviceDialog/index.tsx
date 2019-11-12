import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {AccessDeviceService} from "../../../../service/AccessDeviceService";
import {AccessDevice} from "../../types";

type Props = {
    mode: 'add' | 'edit'
    accessDeviceToEdit?: AccessDevice
    onDialogSuccess: Function
    onDialogFailure: Function
    isOpen: boolean
    onClose: Function
}

export default function AccessDeviceDialog(props: Props) {

    const accessDeviceService = new AccessDeviceService();
    const [accessDeviceName, setAccessDeviceName] = useState('');

    useEffect(() => {
        if(props.mode === 'edit' && props.accessDeviceToEdit !== undefined) {
            setAccessDeviceName(props.accessDeviceToEdit.name);
        } else {
            setAccessDeviceName('');
        }
    }, [props]);

    const handleFormChange = (event: React.SyntheticEvent) => {
        event.persist();
        const input = event.target as HTMLInputElement;
        setAccessDeviceName(input.value);
    };

    const clearFormValues = () => {
        setAccessDeviceName('')
    };

    const isFormValid = () => {
        return accessDeviceName !== '';
    };

    const handleAdd = async () => {
        try {
            await accessDeviceService.addDevice(accessDeviceName);
            props.onDialogSuccess();
        } catch (e) {
            props.onDialogFailure();
            console.error(e);
        }
        clearFormValues();
    };

    const handleEdit = async () => {
        try {
            if(props.accessDeviceToEdit !== undefined) {
                await accessDeviceService.editDevice(props.accessDeviceToEdit.id, accessDeviceName);
                props.onDialogSuccess();
            } else {
                throw new Error('No accessDevice object present in props in handleEdit');
            }
        } catch (e) {
            props.onDialogFailure();
            console.error(e);
        }
        clearFormValues();
    };

    const handleClose = async () => {
        clearFormValues();
        props.onClose();
    };

    const submitOnEnterPressed = (event: React.KeyboardEvent, mode: 'add' | 'edit') => {
        if (event.key === 'Enter' && isFormValid()) {
            event.preventDefault();
            if(mode === 'add') {
                handleAdd();
            } else {
                handleEdit();
            }
        }
    }

    return (
        <div>
            <Dialog open={props.isOpen} onClose={(event: React.SyntheticEvent<HTMLElement>) => {
                props.onClose(event)
            }} aria-labelledby="form-dialog-title">
                <DialogTitle
                    id="form-dialog-title">{props.mode === 'add' ? 'Zugrifssgerät anlegen' : 'Zugrifssgerät ändern'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.mode === 'add'
                            ? 'Bitte gib einen Namen für das Zugriffsgerät an. Der API Key wird automatisch generiert'
                            : ''}

                    </DialogContentText>
                    <TextField
                        value={accessDeviceName}
                        name="accessDeviceName"
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        label="Name des Zugriffsgeräts"
                        type="text"
                        fullWidth={true}
                        required={true}
                        onChange={(event) => handleFormChange(event)}
                        onKeyPress={(event) => submitOnEnterPressed(event, props.mode)}
                        inputProps={{
                            maxLength: 32,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={(event: React.SyntheticEvent<HTMLElement>) => {
                            handleClose()
                        }}
                        color="primary"
                    >
                        Abbrechen
                    </Button>
                    <Button
                        disabled={!isFormValid()}
                        onClick={props.mode === 'add' ? handleAdd : handleEdit}
                        color="primary"
                    >
                        {props.mode === 'add' ? 'Anlegen' : 'Ändern'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}