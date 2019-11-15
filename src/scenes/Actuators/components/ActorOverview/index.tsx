import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Chip
} from "@material-ui/core";
import EnhancedTableToolbar from "../../../../components/EnhancedTableToolbar";
import EnhancedTableHead from "../../../../components/EhancedTableHead";
import {getSorting, stableSort} from "../../../../utils/sorting";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {ConfirmationDialogState, Actuator} from "./types";
import ActuatorDialog from "../ActuatorDialog";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../../../components/EhancedTableHead/types";
import useTheme from "@material-ui/core/styles/useTheme";
import {ActuatorService} from "../../../../service/ActuatorService";
import { useHistory } from "react-router-dom";
import PowerIcon from '@material-ui/icons/Power';

const ActuatorOverview: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [actuators, setActuators] = React.useState<Actuator[]>([]);
    const [isActuatorialogVisible, setIsActuatorDialogVisible] = React.useState<boolean>(false);
    const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogState>({
        heading: '',
        confirmationText: '',
        agreeAction: () => {
        },
        disagreeAction: () => {
        }
    });
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
    const [actuatorToEdit, setActuatorToEdit] = useState<Actuator | undefined>(undefined);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const dispatch = useDispatch();
    const pageTitle = 'Aktoren verwalten';

    const actuatorService = new ActuatorService();

    const fetchActuatorsToState = async () => {
        const actuators = await actuatorService.getAllactuators();
        setActuators(actuators);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchActuatorsToState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            const newSelecteds = actuators.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleSingleSelection = (event: React.SyntheticEvent, id: string) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.SyntheticEvent) => {
        const input = event.target as HTMLInputElement;
        setRowsPerPage(+input.value);
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, actuators.length - page * rowsPerPage);

    const deleteUserActuator = async (userPermissionId: string | string[]): Promise<void> => {
        await actuatorService.deleteActuators(userPermissionId);
        await fetchActuatorsToState();
        setSelected([]);
    };

    const onEditActuatorDialogSuccess = async () => {
        enqueueSnackbar('Der Aktor wurde erfolgreich geändert', {variant: 'success'});
        setIsActuatorDialogVisible(false);
        setActuatorToEdit(undefined);
        await fetchActuatorsToState();
    };

    const onEditDialogFailure = () => {
        enqueueSnackbar('Fehler beim Ändern des Aktors', {variant: 'warning'});
        setActuatorToEdit(undefined);
        setIsActuatorDialogVisible(false);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleActuatorDeletion = (actuatorId: string | string[]) => {
        deleteUserActuator(actuatorId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Aktor(en) wurde(n) erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSingleActuatorDeletion = (actuatorId: string) => {
        const ActuatorToDeleteName = getActuatorName(actuators, actuatorId);
        handleConfirmation('Aktor wirklich löschen?',
            `Möchtest Du den Aktor "${ActuatorToDeleteName}" wirklich löschen?`,
            () => handleActuatorDeletion(actuatorId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultipleActuatorDeletion = (actuatorIdsToDelete: string[]) => {
        const areAllActuatorsSelected = actuatorIdsToDelete.length === actuators.length;
        const ActuatorNamesToDelete = areAllActuatorsSelected
            ? 'ALLE Aktoren'
            : `die Aktoren "${actuators.filter(userPermission => actuatorIdsToDelete.indexOf(userPermission.id) !== -1)
                .map(userPermission => userPermission.name)
                .join(', ')}"`;

        handleConfirmation('Aktor wirklich löschen?',
            `Möchtest Du wirklich die Aktoren ${ActuatorNamesToDelete} löschen?`,
            () => handleActuatorDeletion(actuatorIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleOpenDeviceDialog = (userPermissionId?: string) => {
        const userPermissionToEdit: Actuator | undefined = actuators.find(userPermission => userPermission.id === userPermissionId);
        setActuatorToEdit(userPermissionToEdit);
        setIsActuatorDialogVisible(true);
    };

    const getActuatorName = (userPermission: Actuator[], userPermissionID: string) => {
        const userPermissionToDelete = userPermission.find(userPermission => userPermission.id === userPermissionID);
        return userPermissionToDelete !== undefined ? userPermissionToDelete.name : '';
    };

    const getStatusColor = (status: 'online' | 'offline' | 'unknown'): 'primary' | 'secondary' | undefined => {
        if (status === 'online') {
            return 'primary'
        }
        if (status === 'offline') {
            return 'secondary'
        }
        return undefined
    };

    const headCells: headCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Bezeichnung des Aktors',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'system',
            numeric: false,
            disablePadding: true,
            label: 'System',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'type',
            numeric: false,
            disablePadding: true,
            label: 'type',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            isSortable: true,
            align: 'left'
        },
        {id: 'actions', numeric: false, disablePadding: true, label: 'Aktionen', isSortable: false, align: 'center'}
    ];

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    deleteFunction={() => {
                        handleMultipleActuatorDeletion(selected)
                    }}
                    addFunction={() => {
                        history.push('/actuators/create')
                    }}
                    tableHeading="Aktoren"
                />
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={actuators.length}
                            isSelectableTable={true}
                        />
                        <TableBody>
                            {stableSort(actuators, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((actuator: Actuator, index: number) => {
                                    const isItemSelected = isSelected(actuator.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={actuator.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, actuator.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {actuator.name}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {actuator.system}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <Chip
                                                    icon={<PowerIcon />}
                                                    label={actuator.type === 'switch' ? 'Schalter' : actuator.type}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <Chip
                                                    color={getStatusColor(actuator.status)}
                                                    label={actuator.status}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleOpenDeviceDialog(actuator.id)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSingleActuatorDeletion(actuator.id)
                                                    }}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 53 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={actuators.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'vorherige Seite',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'nächste Seite',
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    labelDisplayedRows={({from, to, count}) => `Von ${from} bis ${to} gesamt ${count}`}
                    labelRowsPerPage='Einträge pro Seite'
                />
            </Paper>
            <ActuatorDialog
                actuator={actuatorToEdit}
                onDialogSuccess={onEditActuatorDialogSuccess}
                onDialogFailure={onEditDialogFailure}
                isOpen={isActuatorialogVisible}
                onClose={() => {
                    setIsActuatorDialogVisible(false)
                }}
            />
            <ConfirmationDialog
                isOpen={isConfirmationDialogVisible}
                agreeAction={confirmationDialogState.agreeAction}
                explainerText={confirmationDialogState.confirmationText}
                heading={confirmationDialogState.heading}
                disagreeAction={confirmationDialogState.disagreeAction}
            />
        </div>
    );
};

export default ActuatorOverview;