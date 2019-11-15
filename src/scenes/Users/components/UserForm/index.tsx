import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {
    Avatar,
    Button,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import {useDispatch} from "react-redux";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import {useHistory, useParams} from "react-router";
import useTheme from "@material-ui/core/styles/useTheme";
import {UserPermission} from "../../../UserPermissions/types";
import {UserPermissionService} from "../../../../service/UserPermissionService";
import useStyles from './styles';
import {FormErrors, UserDTO} from "./types";
import FormControlledField from "../../../../components/FormControlledField";
import computeFieldValidationStates from "./utils/getFieldValidationStates";
import {debounce} from 'lodash'
import {UserService} from "../../../../service/UserService/UserService";
import {useSnackbar} from "notistack";

export default function UserCreationForm() {
    const generateInitialFieldValidityState = () => {
        return ({
            isValid: true,
            hasBeenTouched: false,
            errorText: ''
        })
    };

    const theme = useTheme();
    const classes = useStyles(theme);
    const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
    const [formValues, setFormValues] = useState<UserDTO>({
        id: '',
        preferedSalutation: 'Mr.',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        emailAddress: '',
        streetName: '',
        houseNumber: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phoneNumber: '',
        mobileNumber: '',
        freeTextField: '',
        accessTokenId: '',
        pin: '',
        isAdmin: false,
        permissionIds: []
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({
        firstName: generateInitialFieldValidityState(),
        lastName: generateInitialFieldValidityState(),
        emailAddress: generateInitialFieldValidityState(),
        streetName: generateInitialFieldValidityState(),
        houseNumber: generateInitialFieldValidityState(),
        city: generateInitialFieldValidityState(),
        zipCode: generateInitialFieldValidityState(),
        country: generateInitialFieldValidityState(),
        accessTokenId: generateInitialFieldValidityState(),
        pin: generateInitialFieldValidityState(),
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const {id} = useParams();

    const userPermissionService = new UserPermissionService();
    const userService = new UserService();

    const dispatch = useDispatch();
    const pageTitle = id ? 'Benutzer ändern' : 'Benutzer anlegen';

    const fetchUserPermissions = async () => {
        const userPermissions = await userPermissionService.getAllUserPermissions()
        setUserPermissions(userPermissions)
    };

    const isPermissionSelected = (id: string) => formValues.permissionIds.indexOf(id) !== -1;

    const fetchUserAndSetDataToState = async (id: string) => {
        try {
            const userData = await userService.getUserById(id);
            setFormValues(prevState => ({
                ...prevState,
                ...userData
            }));
            setIsFormVisible(true);
        } catch (e) {
            enqueueSnackbar('Fehler beim Abfragen der User-Daten', {variant: 'error'})
        }

    };

    useEffect(() => {
        dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        fetchUserPermissions();

        if (id) {
            fetchUserAndSetDataToState(id);

            for (const formError in formErrors) {
                if (formErrors.hasOwnProperty(formError)) {
                    formErrors[formError].isValid = true;
                    formErrors[formError].hasBeenTouched = true;
                }
            }
            debounceFormValidation(formErrors);
        } else {
            setIsFormVisible(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const debounceFormValidation = debounce((formErrors: FormErrors) => {
        setIsFormValid(computeFormValidation(formErrors));
    }, 500);


    const handlePermissionSelection = (id: string) => {
        const selectedPermissionIndex = formValues.permissionIds.indexOf(id);
        let newSelected: string[] = [];

        if (selectedPermissionIndex === -1) {
            newSelected = newSelected.concat(formValues.permissionIds, id);
        } else if (selectedPermissionIndex === 0) {
            newSelected = newSelected.concat(formValues.permissionIds.slice(1));
        } else if (selectedPermissionIndex === formValues.permissionIds.length - 1) {
            newSelected = newSelected.concat(formValues.permissionIds.slice(0, -1));
        } else if (selectedPermissionIndex > 0) {
            newSelected = newSelected.concat(
                formValues.permissionIds.slice(0, selectedPermissionIndex),
                formValues.permissionIds.slice(selectedPermissionIndex + 1),
            );
        }

        setFormValues(prevState => ({
            ...prevState,
            permissionIds: newSelected
        }));
    };

    const handleFormChange = (event: React.SyntheticEvent) => {
        //event.persist();
        const input = event.target as HTMLInputElement;
        setFormValues(oldFormValues => ({
            ...oldFormValues,
            [input.name]: input.value
        }));
        if (formErrors[input.name]) {
            if (!formErrors[input.name].isValid || input.value === '') {
                handleFormValidation(event);
            }
        }
        debounceFormValidation(computeFieldValidationStates(input.name, input.value, formErrors));
    };

    const handleFormValidation = (event: React.SyntheticEvent) => {
        event.preventDefault();
        const input = event.target as HTMLInputElement;
        const {name, value} = input;
        setFormErrors(prevState => ({
            ...prevState,
            ...computeFieldValidationStates(name, value, formErrors)
        }));
    };

    const handleSubmit = async () => {
        if(id) {
            try {
                await userService.updateUser(formValues);
                enqueueSnackbar('Benutzer wurden erfolgreich geändert', {variant: 'success'});
                history.push('/users')
            } catch (e) {
                enqueueSnackbar('Fehler beim Ändern des Benutzers', {variant: 'error'});
            }
        } else {
            try {
                await userService.addUser(formValues);
                enqueueSnackbar('Benutzer wurden erfolgreich angelegt', {variant: 'success'});
                history.push('/users')
            } catch (e) {
                enqueueSnackbar('Fehler beim Anlegen des Benutzers', {variant: 'error'});
            }
        }


    };

    const computeFormValidation = (formErrors: FormErrors) => {
        for (const formField in formErrors) {
            if (!formErrors[formField].isValid) {
                return false;
            }
        }

        for (const formField in formErrors) {
            if (!formErrors[formField].hasBeenTouched) {
                return false;
            }
        }
        return true;
    };

    const toggleIsAdmin = () => {
        setFormValues(oldFormValues => ({
            ...oldFormValues,
            isAdmin: !formValues.isAdmin
        }));
    };

    return (isFormVisible ?
            (
                <div className={classes.root}>
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={true}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Personendaten
                                </Typography>
                                <Grid
                                    container={true}
                                    spacing={1}
                                    direction="column"
                                    justify={"space-evenly"}
                                    alignItems={"stretch"}
                                    style={{minHeight: '400px'}}
                                >
                                    <Avatar
                                        style={{
                                            width: '160px',
                                            height: '160px',
                                            backgroundColor: '#59804E',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        <PersonIcon style={{fontSize: '180px'}}/>
                                    </Avatar>
                                    <Grid item={true}>
                                        <FormControlledField
                                            value={formValues.firstName}
                                            id="firstName"
                                            name="firstName"
                                            label="Vorname"
                                            required={true}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.firstName.isValid}
                                            errorText={formErrors.firstName.errorText}
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={true}
                                            id="lastName"
                                            name="lastName"
                                            label="Nachname"
                                            value={formValues.lastName}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.lastName.isValid}
                                            errorText={formErrors.lastName.errorText}
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={true}
                                            id="emailAddress"
                                            name="emailAddress"
                                            label="E-Mail-Adresse"
                                            value={formValues.emailAddress}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.emailAddress.isValid}
                                            errorText={formErrors.emailAddress.errorText}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={true} sm={8}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Adresse
                                </Typography>
                                <Grid
                                    container={true}
                                    direction="column"
                                    justify={"space-evenly"}
                                    style={{minHeight: '400px'}}
                                >
                                    <Grid container={true} direction={"row"} justify={"space-between"}>
                                        <Grid item={true} xs={8}>
                                            <FormControlledField
                                                required={true}
                                                id="streetName"
                                                name="streetName"
                                                label="Straße"
                                                value={formValues.streetName}
                                                onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                                onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                                hasError={!formErrors.streetName.isValid}
                                                errorText={formErrors.streetName.errorText}
                                            />
                                        </Grid>
                                        <Grid item={true} xs={3}>
                                            <FormControlledField
                                                required={true}
                                                id="houseNumber"
                                                name="houseNumber"
                                                label="Hausnummer"
                                                value={formValues.houseNumber}
                                                onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                                onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                                hasError={!formErrors.houseNumber.isValid}
                                                errorText={formErrors.houseNumber.errorText}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={true}
                                            id="city"
                                            name="city"
                                            label="Stadt"
                                            value={formValues.city}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.city.isValid}
                                            errorText={formErrors.city.errorText}
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={false}
                                            id="state"
                                            name="state"
                                            label="Staat/Provinz/Region"
                                            value={formValues.state}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={false}
                                            errorText=''
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={true}
                                            id="zipCode"
                                            name="zipCode"
                                            label="PLZ"
                                            value={formValues.zipCode}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.zipCode.isValid}
                                            errorText={formErrors.zipCode.errorText}
                                        />
                                    </Grid>
                                    <Grid item={true}>
                                        <FormControlledField
                                            required={true}
                                            id="country"
                                            name="country"
                                            label="Land"
                                            value={formValues.country}
                                            onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                            onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                            hasError={!formErrors.country.isValid}
                                            errorText={formErrors.country.errorText}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Zusätzliche Information
                                </Typography>
                                <Grid container={true} direction="row" justify="space-between">
                                    <TextField
                                        id="freeTextField"
                                        name="freeTextField"
                                        label="Freitextfeld"
                                        value={formValues.freeTextField}
                                        onChange={event => handleFormChange(event)}
                                        multiline={true}
                                        rows="4"
                                        className={classes.textField}
                                        margin="normal"
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={true}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Zugangsmedium
                                </Typography>
                                <Grid item={true}>
                                    <FormControlledField
                                        required={true}
                                        id="accessTokenId"
                                        name="accessTokenId"
                                        label="Access Token UID"
                                        value={formValues.accessTokenId}
                                        onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                        onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                        hasError={!formErrors.accessTokenId.isValid}
                                        errorText={formErrors.accessTokenId.errorText}
                                    />
                                </Grid>
                                <Grid item={true}>
                                    <FormControlledField
                                        required={true}
                                        id="pin"
                                        name="pin"
                                        label="PIN"
                                        value={formValues.pin}
                                        onChangeFunction={(event: React.SyntheticEvent) => handleFormChange(event)}
                                        onBlurFunction={(event: React.SyntheticEvent) => handleFormValidation(event)}
                                        hasError={!formErrors.pin.isValid}
                                        errorText={formErrors.pin.errorText}
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={true}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Administration
                                </Typography>
                                <Grid item={true}>
                                    <FormControlLabel
                                        control={
                                            (
                                                <Switch
                                                    checked={formValues.isAdmin}
                                                    name="isAdmin"
                                                    onChange={(event: React.SyntheticEvent) => toggleIsAdmin()}
                                                    color="primary"
                                                />
                                            )
                                        }
                                        label={formValues.isAdmin ? 'Benutzer ist Administrator' : 'Benutzer ist kein Administrator'}
                                    />
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Paper className={classes.paper}>
                                <Typography variant="h6" gutterBottom={true}>
                                    Berechtigungen
                                </Typography>
                                <Grid container={true} direction="row" justify="space-between">
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="justify">Bezeichnung</TableCell>
                                                <TableCell align="justify">Beschreibung</TableCell>
                                                <TableCell align="justify">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {userPermissions.map(userPermission => (
                                                <TableRow key={userPermission.id}>
                                                    <TableCell component="th" scope="row">
                                                        {userPermission.name}
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">
                                                        {userPermission.description}
                                                    </TableCell>
                                                    <TableCell align="justify">
                                                        <FormControlLabel
                                                            control={
                                                                (
                                                                    <Switch
                                                                        style={{alignSelf: 'center'}}
                                                                        checked={isPermissionSelected(userPermission.id)}
                                                                        onChange={(event) => {
                                                                            handlePermissionSelection(userPermission.id)
                                                                        }}
                                                                        color="primary"
                                                                    />
                                                                )
                                                            }
                                                            label={isPermissionSelected(userPermission.id) ? 'Berechtigung gesetzt' : 'Berechtigung nicht gesetzt'}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

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
                                    history.push('/users')
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
