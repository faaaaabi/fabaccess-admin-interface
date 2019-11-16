import React, {useEffect, useState} from "react";

import useTheme from "@material-ui/core/styles/useTheme";
import useStyles from "./styles";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import {Button, InputLabel, List, ListItemIcon, ListItemText} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useDispatch} from "react-redux";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import PowerIcon from '@material-ui/icons/Power';
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlledField from "../../../../components/FormControlledField";
import {useHistory} from "react-router-dom";
import {ActuatorService} from "../../../../service/ActuatorService";
import {debounce} from "lodash";
import {useSnackbar} from "notistack";


const ActuatorCreationForm: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [selectedAutomationPlattform, setSelectedAutomationPlattform] = useState<string>('');
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [isLoadingActuator, setIsLoadingActuators] = React.useState<boolean>(false);
    const [actuactorToAddDescription, setActuactorToAddDescription] = React.useState<string>('');
    const [actuactorToAddDescriptionError, setActuactorToAddDescriptionError] = React.useState({
        hasError: false,
        errorText: ''
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const dispatch = useDispatch();
    const pageTitle = 'Aktor anlegen';

    const actuatorService = new ActuatorService();

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
    }, [dispatch]);

    const fetchActuators = () => {
        setIsLoadingActuators(true);
        setTimeout(() => {
            setIsLoadingActuators(false);
        }, Math.floor(Math.random() * (2000 - 200 + 1) + 200))
    };

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedAutomationPlattform(event.target.value as string);
        fetchActuators();
    };

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    const handleFormChange = (event: React.ChangeEvent) => {
        const input = event.target as HTMLInputElement;
        setActuactorToAddDescription(input.value);
        debounceFormValidation(input.value);
    };

    const handleOnBlur = () => {
        checkAndSetFormErrors();
    };

    const handleSubmit = async () => {
        try {
            await actuatorService.addActuator(actuactorToAddDescription, 'openHAB', 'switch');
            enqueueSnackbar('Aktor erfolgreich angelegt', {variant: 'success'});
            history.push('/actors');
        } catch (e) {
            enqueueSnackbar('Fehler beim Anlegen des Aktors', {variant: 'error'});
        }
    };

    const checkAndSetFormErrors = () => {
        if (actuactorToAddDescription === '') {
            setActuactorToAddDescriptionError({
                hasError: true,
                errorText: 'Diese Feld muss ausgefüllt werden'
            });
        } else {
            setActuactorToAddDescriptionError({
                hasError: false,
                errorText: ''
            });
        }
    };

    const debounceFormValidation = debounce((formField: string) => {
        setIsFormValid(formField !== '');
    }, 500);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom={true}>
                    Automations System
                </Typography>
                <Grid
                    container={true}
                    direction='column'
                    spacing={4}
                    alignContent='center'
                >
                    <Grid item={true}>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">Automation System</InputLabel>
                            <Select
                                id="demo-simple-select"
                                className={classes.select}
                                value={selectedAutomationPlattform}
                                autoWidth={true}
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>keine Auswahl</em>
                                </MenuItem>
                                <MenuItem value='openHAB'>openHAB</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom={true}>
                    Zum Anlegen verfügbare Aktoren
                </Typography>
                <Grid
                    container={true}
                    direction='column'
                    spacing={4}
                    alignContent='center'
                >
                    <Grid item={true}>
                        {selectedAutomationPlattform === 'openHAB' ?
                            (isLoadingActuator ?
                                    (
                                        <CircularProgress/>
                                    )
                                    :
                                    (
                                        <div className={classes.addableActorList}>
                                            <List component="nav" aria-label="main mailbox folders">

                                                <ListItem
                                                    button={true}
                                                    selected={selectedIndex === 1}
                                                    onClick={event => handleListItemClick(event, 1)}
                                                >
                                                    <ListItemIcon>
                                                        <PowerIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Z-Wave Node 2: FGWP102 Metered Wall Plug Switch"
                                                        secondary="Type: Schalter"
                                                    />
                                                </ListItem>
                                                <Divider/>
                                                <ListItem
                                                    button={true}
                                                    selected={selectedIndex === 2}
                                                    onClick={event => handleListItemClick(event, 2)}
                                                >
                                                    <ListItemIcon>
                                                        <PowerIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Z-Wave Node 3: FGWP102 Metered Wall Plug Switch "
                                                        secondary="Type: Schalter"
                                                    />
                                                </ListItem>
                                            </List>
                                        </div>
                                    )
                            ) :
                            (
                                <Typography variant="body1" gutterBottom={true}>
                                    <Box fontStyle="italic">
                                        Bitte ein Automationssystem auswählen
                                    </Box>
                                </Typography>
                            )
                        }
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom={true}>
                    Einstellungen
                </Typography>
                <Grid
                    container={true}
                    direction='column'
                    spacing={4}
                    alignContent='center'
                >
                    <Grid item={true}>
                        {selectedIndex === 0 ?
                            (
                                <Typography variant="body1" gutterBottom={true}>
                                    <Box fontStyle="italic">
                                        Bitte einen Aktor auswählen
                                    </Box>
                                </Typography>
                            ) :
                            (
                                <FormControlledField
                                    className={classes.textField}
                                    required={true}
                                    id="actuactorToAddDescription"
                                    name="actuactorToAddDescription"
                                    label="Bezeichnung für den anzulegenden Aktor"
                                    value={actuactorToAddDescription}
                                    onChangeFunction={(event: React.ChangeEvent) => handleFormChange(event)}
                                    onBlurFunction={(event: React.ChangeEvent) => handleOnBlur()}
                                    hasError={actuactorToAddDescriptionError.hasError}
                                    errorText={actuactorToAddDescriptionError.errorText}
                                />
                            )
                        }
                    </Grid>
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
                Anlegen
            </Button>
            <Button
                variant="contained"
                color="secondary"
                style={{float: "right"}}
                onClick={(event: React.SyntheticEvent<HTMLElement>) => {
                    history.push('/actuators')
                }}
                className={classes.button}
            >
                Abbrechen
            </Button>
        </div>

    )
};

export default ActuatorCreationForm