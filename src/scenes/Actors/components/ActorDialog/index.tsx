import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ActorService} from "../../../../service/ActorService";
import {Actor} from "../../types";

type Props = {
    actor?: Actor
    onDialogSuccess: Function
    onDialogFailure: Function
    isOpen: boolean
    onClose: Function
}

export default function ActorDialog(props: Props) {

    const actorService = new ActorService();

    const [formValues, setFormValues] = useState({
        actorName: '',
    });

    useEffect(() => {
        if (props.actor) {
            setFormValues({
                actorName: props.actor.name,
            });
        }
    }, [props]);

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
            actorName: '',
        })
    };

    const isFormValid = () => {
        return formValues.actorName !== '';
    };

    const handleEdit = async () => {
        try {
            if (props.actor !== undefined) {
                await actorService.editActor(props.actor.id, formValues.actorName);
                props.onDialogSuccess();
            } else {
                throw new Error('No actor object object present in props in handleEdit');
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

    const submitOnEnterPressed = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && isFormValid()) {
            event.preventDefault();
            handleEdit();
        }
    };

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
                    id="form-dialog-title"
                >
                    Aktor umbenennen
                </DialogTitle>
                <DialogContent>
                    <TextField
                        value={formValues.actorName}
                        name="actorName"
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        label="Name des Aktors"
                        type="text"
                        fullWidth={true}
                        required={true}
                        onChange={(event) => handleFormChange(event)}
                        onKeyPress={(event) => submitOnEnterPressed(event)}
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
                        onClick={handleEdit}
                        color="primary"
                    >
                        Ändern
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}