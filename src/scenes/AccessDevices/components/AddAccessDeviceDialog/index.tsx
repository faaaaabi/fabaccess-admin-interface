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
import {InputLabel, List, ListItemIcon, ListItemText} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import PowerIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import useStyles from "../../../Actuators/components/ActuatorCreationForm/styles";
import {Place} from "../../../Places/types";
import {PlacesService} from "../../../../service/PlacesService";

type Props = {
    mode: 'add' | 'edit'
    accessDeviceToEdit?: AccessDevice
    onDialogSuccess: Function
    onDialogFailure: Function
    isOpen: boolean
    onClose: Function
}

export default function AccessDeviceDialog(props: Props) {
    const theme = useTheme();
    const classes = useStyles(theme);
    const accessDeviceService = new AccessDeviceService();
    const placesService = new PlacesService();
    const [accessDeviceName, setAccessDeviceName] = useState('');
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [allPlaces, setAllPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<string>('');

    useEffect(() => {
        if(props.mode === 'edit' && props.accessDeviceToEdit !== undefined) {
            setAccessDeviceName(props.accessDeviceToEdit.name);
            setSelectedPlace(props.accessDeviceToEdit.placeId as string);
        } else {
            clearFormValues();
        }
        fetchAllPlacesToState();
    }, [props]);


    const handleFormChange = (event: React.SyntheticEvent) => {
        event.persist();
        const input = event.target as HTMLInputElement;
        setAccessDeviceName(input.value);
    };

    const clearFormValues = () => {
        setAccessDeviceName('');
        setSelectedPlace('');
    };

    const isFormValid = () => {
        return accessDeviceName !== '';
    };

    const handleAdd = async () => {
        try {
            await accessDeviceService.addDevice(accessDeviceName, selectedPlace);
            props.onDialogSuccess();
        } catch (e) {
            props.onDialogFailure();
            console.error(e);
        }
        clearFormValues();
    };

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    const handleEdit = async () => {
        try {
            if(props.accessDeviceToEdit !== undefined) {
                await accessDeviceService.editDevice(props.accessDeviceToEdit.id, accessDeviceName, selectedPlace);
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

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedPlace(event.target.value as string);
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
    };

    const fetchAllPlacesToState = async () => {
        const allPlaces = await placesService.getAllPlaces();
        setAllPlaces(allPlaces);
    };

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
                        style={{paddingBottom: theme.spacing(2)}}
                    />
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Zugewiesener Ort</InputLabel>
                        <Select
                            id="demo-simple-select"
                            className={classes.select}
                            value={selectedPlace}
                            autoWidth={true}
                            onChange={handleChange}
                        >
                            {
                                allPlaces.map(place => {
                                    return (
                                        <MenuItem key={place.id} value={place.id}>{place.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
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