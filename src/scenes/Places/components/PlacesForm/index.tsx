import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Avatar, Button, Paper} from "@material-ui/core";
import MyLocationItem from '@material-ui/icons/MyLocation';
import {useDispatch} from "react-redux";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import {useHistory, useParams} from "react-router";
import useTheme from "@material-ui/core/styles/useTheme";
import useStyles from './styles';
import {FormErrors} from "./types";
import FormControlledField from "../../../../components/FormControlledField";
import {debounce} from 'lodash'
import {useSnackbar} from "notistack";
import {PlacesService} from '../../../../service/PlacesService';
import {Place} from "../../types";
import {Machine} from "../../../Machines/types";
import {MachineService} from "../../../../service/MachineService";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import Draggable from 'react-draggable';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import TextField from "@material-ui/core/TextField";
import ClearIcon from '@material-ui/icons/Clear';

export default function PlacesForm() {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [formValues, setFormValues] = useState<Place>({
        id: '',
        name: '',
        description: '',
        assignedMachineIds: []
    });
    const [availableMachine, setAvailableMachines] = useState<Machine[]>([]);
    const [machinesAssignedToThisPlace, setMachinesAssignedToThisPlace] = useState<Machine[]>([]);
    const [availableMachineIds, setAvailableMachineIds] = useState<string[]>();
    const [allMachines, setAllMachines] = useState<Machine[]>([]);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [placeToAddNameFieldError, setPlaceToAddNameFieldError] = useState({
        hasError: false,
        errorText: ''
    });

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const {id} = useParams();

    const machineService = new MachineService();
    const placesService = new PlacesService();

    const dispatch = useDispatch();
    const pageTitle = id ? 'Benutzer ändern' : 'Benutzer anlegen';

    const fetchAllMachinesToState = async () => {
        const allMachines = await machineService.getAllMachines();
        setAllMachines(allMachines);
    };

    const fetchAvailableMAchineIdsToState = async () => {
        const machineIdsAssignedToOtherPlace = await placesService.getAllAssignedMachineIds();
        const allMachines = await machineService.getAllMachines();
        const availableMachines = allMachines.filter(machine => machineIdsAssignedToOtherPlace.indexOf(machine.id) === -1);
        setAvailableMachineIds(availableMachines.map(machine => machine.id));
    };

    const fetchPlaceToState = async (id: string) => {
        try {
            const userData = await placesService.getPlaceById(id);
            setFormValues(prevState => ({
                ...prevState,
                ...userData
            }));
            setIsFormVisible(true);
        } catch (e) {
            enqueueSnackbar('Fehler beim Abfragen des Ortes', {variant: 'error'})
        }

    };

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        if (id) {
            fetchPlaceToState(id);
            fetchAllMachinesToState();
            fetchAvailableMAchineIdsToState();
            debounceFormValidation(formValues.name);
        } else {
            setIsFormVisible(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        debounceFormValidation(formValues.name);
    }, [formValues.name]);

    const debounceFormValidation = debounce((formField: string) => {
        setIsFormValid(formField !== '');
    }, 500);

    const checkAndSetFormErrors = () => {
        if (formValues.name === '') {
            setPlaceToAddNameFieldError({
                hasError: true,
                errorText: 'Diese Feld muss ausgefüllt werden'
            });
        } else {
            setPlaceToAddNameFieldError({
                hasError: false,
                errorText: ''
            });
        }
    };

    const handleMachineSelection = (id: string) => {
        const selectedPlaceIndex = formValues.assignedMachineIds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedPlaceIndex === -1) {
            newSelected = newSelected.concat(formValues.assignedMachineIds, id);
        } else if (selectedPlaceIndex === 0) {
            newSelected = newSelected.concat(formValues.assignedMachineIds.slice(1));
        } else if (selectedPlaceIndex === formValues.assignedMachineIds.length - 1) {
            newSelected = newSelected.concat(formValues.assignedMachineIds.slice(0, -1));
        } else if (selectedPlaceIndex > 0) {
            newSelected = newSelected.concat(
                formValues.assignedMachineIds.slice(0, selectedPlaceIndex),
                formValues.assignedMachineIds.slice(selectedPlaceIndex + 1),
            );
        }

        setFormValues(prevState => ({
            ...prevState,
            assignedMachineIds: newSelected
        }));

        if(availableMachineIds) {
            const indexToRemove = availableMachineIds.indexOf(id);
            const availableMachineIdsCopy = availableMachineIds;
            if (indexToRemove > -1) {
                availableMachineIdsCopy.splice(indexToRemove, 1);
            }
            setAvailableMachineIds(availableMachineIdsCopy);
        }

    };

    const isMachineSelected = (id: string) => formValues.assignedMachineIds.indexOf(id) !== -1;

    const handleFormChange = (event: React.SyntheticEvent) => {
        //event.persist();
        const input = event.target as HTMLInputElement;
        setFormValues(oldFormValues => ({
            ...oldFormValues,
            [input.name]: input.value
        }));
        //debounceFormValidation(input.value);
    };

    const handleFormValidation = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const handleOnBlur = () => {
        checkAndSetFormErrors();
    };

    const handleSubmit = async () => {
        if (id) {
            try {
                await placesService.editPlace(formValues.id, formValues.name, formValues.description, formValues.assignedMachineIds);
                enqueueSnackbar('Ort wurde erfolgreich geändert', {variant: 'success'});
                history.push('/places')
            } catch (e) {
                enqueueSnackbar('Fehler beim Ändern des Ortes', {variant: 'error'});
            }
        } else {
            try {
                await placesService.addPlace(formValues.name, formValues.description, formValues.assignedMachineIds);
                enqueueSnackbar('Ort wurde erfolgreich angelegt', {variant: 'success'});
                history.push('/places')
            } catch (e) {
                enqueueSnackbar('Fehler beim Anlegen des Ortes', {variant: 'error'});
            }
        }
    };

    const removeAssignedMachine = (id: string) => {
        console.log('machineIdToDelte:', id);
        const assignedMachineIds = formValues.assignedMachineIds;
        const indexToRemove = assignedMachineIds.indexOf(id);
        if (indexToRemove > -1) {
            assignedMachineIds.splice(indexToRemove, 1);
        }
        setFormValues(prevState => ({
            ...prevState,
            assignedMachineIds
        }))

        const availableMachineIdsCopy = availableMachineIds;
        if(availableMachineIdsCopy) {
            availableMachineIdsCopy.push(id);
            setAvailableMachineIds(availableMachineIdsCopy);
        }

    };

    return (isFormVisible ?
            (
                <div className={classes.root}>
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={true}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Stammdaten
                                </Typography>
                                <Grid
                                    container={true}
                                    spacing={1}
                                    direction="column"
                                    justify={"space-evenly"}
                                    alignItems={"stretch"}
                                    style={{minHeight: '400px'}}
                                >
                                    <MyLocationItem color={"primary"} style={{fontSize: '180px', alignSelf: 'center'}}/>
                                    <Grid item={true}>
                                        <FormControlledField
                                            value={formValues.name}
                                            id="name"
                                            name="name"
                                            label="Name des Ortes"
                                            required={true}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={handleOnBlur}
                                            hasError={placeToAddNameFieldError.hasError}
                                            errorText={placeToAddNameFieldError.errorText}
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <TextField
                                            id="description"
                                            name="description"
                                            label="Beschreibung des Ortes"
                                            value={formValues.description}
                                            onChange={event => handleFormChange(event)}
                                            multiline={true}
                                            rows="4"
                                            className={classes.textField}
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={true} sm={8} style={{minHeight: '350px'}}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Verfügbare Maschinen
                                    <Box fontWeight="fontWeightLight" m={1}>
                                        Maschine auswählen um sie dem Ort hinzuzufügen
                                    </Box>
                                </Typography>
                                <Grid item={true} style={{height: '360px', overflowY: 'auto'}}>
                                    <List dense={true} className={classes.list}>
                                        {allMachines
                                            .filter(machine => {
                                                if(availableMachineIds) {
                                                    return availableMachineIds.indexOf(machine.id) !== -1
                                                }
                                            })
                                            .map(machine => {
                                            const labelId = `checkbox-list-secondary-label-${machine}`;
                                            return (
                                                <ListItem
                                                    key={machine.id}
                                                    button={true}
                                                    onClick={() => handleMachineSelection(machine.id)}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <DeveloperBoardIcon/>
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText id={labelId} primary={machine.name}/>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Anordnung der Maschinen am Ort
                                    <Box fontWeight="fontWeightLight" m={1}>
                                        Work in progress!!
                                    </Box>
                                </Typography>
                                <Grid container={true} direction="row" justify="space-between"
                                      style={{position: 'relative', height: '400px'}}>
                                    {
                                        allMachines.map(machine => {
                                            if(formValues.assignedMachineIds.indexOf(machine.id) !== -1) {
                                                return (
                                                    <Draggable
                                                        key={machine.id}
                                                        bounds='parent'
                                                        grid={[12, 12]}
                                                        //position={{x: 0+25*index, y: 0}}
                                                    >
                                                        <div className={classes.boxHighlighted}>
                                                            <ClearIcon
                                                                fontSize='small'
                                                                color='secondary'
                                                                onClick={() => removeAssignedMachine(machine.id)}
                                                            />
                                                            <p>{machine.name}</p>
                                                        </div>
                                                    </Draggable>
                                                )
                                            }
                                        })
                                    }
                                </Grid>
                            </Paper>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{float: "right"}}
                                onClick={(event: React.SyntheticEvent<HTMLElement>) => {
                                    handleSubmit();
                                }}
                                disabled={!isFormValid}
                                className={classes.button}
                            >
                                {id ? 'Änderungen Speichern' : 'Anlegen'}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                style={{float: "right"}}
                                onClick={(event: React.SyntheticEvent<HTMLElement>) => {
                                    history.push('/places')
                                }}
                                className={classes.button}
                            >
                                Abbrechen
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )
            :
            (
                <div/>
            )
    );
}
