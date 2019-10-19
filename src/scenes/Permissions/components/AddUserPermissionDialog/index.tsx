import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {UserPermissionService} from "../../../../service/UserPermissionService";
import {UserPermission} from "../../types";

type Props = {
    mode: 'add' | 'edit'
    userPermission?: UserPermission
    onDialogSuccess: Function
    onDialogFailure: Function
    isOpen: boolean
    onClose: Function
}

export default function AddAccessDeviceDialog(props: Props) {

    const userPermissionService = new UserPermissionService();
    let userPermissionToEditId = '';
    let userPermissionToEditName = '';
    let userPermissionToEditDescription = '';

    if (props.userPermission) {
        userPermissionToEditId = props.userPermission.id;
        userPermissionToEditName = props.userPermission.name;
        userPermissionToEditDescription = props.userPermission.description;
    }

    const [formValues, setFormValues] = useState({
        userPermissionName: '',
        userPermissionDescription: ''
    });

    useEffect(() => {
        setFormValues({
            userPermissionName: userPermissionToEditName,
            userPermissionDescription: userPermissionToEditDescription
        });
    }, [userPermissionToEditName, userPermissionToEditDescription]);

    const handleFormChange = (event: React.SyntheticEvent) => {
        event.persist();
        const input = event.target as HTMLInputElement;
        setFormValues(oldFormValues => ({
            ...oldFormValues,
            [input.name]: input.value
        }))

    };

    const clearFormValues = () => {
        setFormValues({
            userPermissionName: '',
            userPermissionDescription: ''
        })
    };

    const isFormValid = () => {
        return formValues.userPermissionName !== '' && formValues.userPermissionDescription !== '';
    };

    const handleAdd = async () => {
        try {
            await userPermissionService.addUserPermission(formValues.userPermissionName, formValues.userPermissionDescription);
            props.onDialogSuccess();
        } catch (e) {
            props.onDialogFailure();
            console.error(e);
        }
        clearFormValues();
    };

    const handleEdit = async () => {
        try {
            await userPermissionService.editUserPermission(userPermissionToEditId, formValues.userPermissionName, formValues.userPermissionDescription);
            props.onDialogSuccess();
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
            if (mode === 'add') {
                handleAdd();
            } else {
                handleEdit();
            }
        }
    }

    return (
        <div>
            <Dialog
                open={props.isOpen}
                onClose={(event: React.SyntheticEvent<HTMLElement>) => {
                    props.onClose(event)
                }}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle
                    id="form-dialog-title">{props.mode === 'add' ? 'Benutzer Berechtigung anlegen' : 'Benutzer Berechtigung ändern'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.mode === 'add'
                            ? 'Bitte gib einen Namen für die Benutzer Berechtigung an.'
                            : ''}

                    </DialogContentText>
                    <TextField
                        value={formValues.userPermissionName}
                        name="userPermissionName"
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        label="Name der Benutzerberechtigung"
                        type="text"
                        fullWidth={true}
                        required={true}
                        onChange={(event) => handleFormChange(event)}
                        onKeyPress={(event) => submitOnEnterPressed(event, props.mode)}
                        inputProps={{
                            maxLength: 32,
                        }}
                    />
                    <TextField
                        value={formValues.userPermissionDescription}
                        name="userPermissionDescription"
                        margin="dense"
                        id="name"
                        label="Beschreibung der Benutzer Berechtigung"
                        type="text"
                        fullWidth={true}
                        required={true}
                        onChange={(event) => handleFormChange(event)}
                        onKeyPress={(event) => submitOnEnterPressed(event, props.mode)}
                        inputProps={{
                            maxLength: 512,
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