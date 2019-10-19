import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {Checkbox, IconButton, Paper, Table, TableBody, TableCell, TablePagination, TableRow} from "@material-ui/core";
import EnhancedTableToolbar from "../../components/EnhancedTableToolbar";
import EnhancedTableHead from "../../components/EhancedTableHead";
import {getSorting, stableSort} from "../../utils/sorting";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {UserPermission, ConfirmationDialogState} from "./types";
import AddUserPermissionsDialog from "./components/AddUserPermissionDialog";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../components/EhancedTableHead/types";
import {UserPermissionService} from "../../service/UserPermissionService";

const UserPermissions: React.FC = () => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [userPermissions, setUserPermissions] = React.useState<UserPermission[]>([]);
    const [isAddAccessDeviceModalVisible, setIsAddAccessDeviceModalVisible] = React.useState<boolean>(false);
    const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogState>({
        heading: '',
        confirmationText: '',
        agreeAction: () => {
        },
        disagreeAction: () => {
        }
    });
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
    const [accessDeviceDialogMode, setAccessDeviceDialogMode] = useState<'add' | 'edit'>('add');
    const [userPermissionToEdit, setUserPermissionToEdit] = useState<UserPermission | undefined>(undefined);
    const {enqueueSnackbar} = useSnackbar();

    const dispatch = useDispatch();
    const pageTitle = 'Zugriffsgeräte';

    const userPermissionService = new UserPermissionService();

    const fetchUserPermissionsToState = async () => {
        const accessDevices = await userPermissionService.getAllUserPermissions();
        setUserPermissions(accessDevices);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
    }, []);

    useEffect(() => {
        fetchUserPermissionsToState();
    }, []);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            const newSelecteds = userPermissions.map((n) => n.id);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, userPermissions.length - page * rowsPerPage);

    const deleteAccessDevice = async (accessDeviceId: string | string[]): Promise<void> => {
        await userPermissionService.deleteUserPermissions(accessDeviceId);
        await fetchUserPermissionsToState();
        setSelected([]);
    };

    const onAddAccessDeviceDialogSuccess = async () => {
        enqueueSnackbar('Die Benutzer Berechtigung wurde erfolgreich angelegt', {variant: 'success'});
        setIsAddAccessDeviceModalVisible(false);
        setUserPermissionToEdit(undefined);
        await fetchUserPermissionsToState();
    };

    const onAddAccessDeviceDialogFailure = () => {
        enqueueSnackbar('Fehler beim anlegen der Benutzer Berechtigung', {variant: 'warning'});
        setUserPermissionToEdit(undefined);
        setIsAddAccessDeviceModalVisible(false);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleDeviceDeletion = (accessDeviceId: string | string[]) => {
        deleteAccessDevice(accessDeviceId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Benutzer Berechtigung(en) wurden erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSingleDeviceDeletion = (accessDeviceId: string) => {
        const accessDeviceToDeleteName = getAccessDeviceName(userPermissions, accessDeviceId);
        handleConfirmation('Benutzer Berechtigung wirklich löschen?',
            `Möchtest Du die Benutzer Berechtigung "${accessDeviceToDeleteName}" wirklich löschen?`,
            () => handleDeviceDeletion(accessDeviceId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultipleDeviceDeletion = (accessDeviceIdsToDelete: string[]) => {
        let deviceNamesToDelete = '';
        const areAllDevicesSelected = accessDeviceIdsToDelete.length === userPermissions.length;
        deviceNamesToDelete = areAllDevicesSelected
            ? 'ALLE Benutzer Berechtigungen'
            : `die Benutzer Berechtigungen "${userPermissions.filter(accessDevice => accessDeviceIdsToDelete.indexOf(accessDevice.id) !== -1)
                .map(accessDevice => accessDevice.name)
                .join(', ')}"`;

        handleConfirmation('Benutzer Berechtigung wirklich löschen?',
            `Möchtest Du wirklich ${deviceNamesToDelete} löschen?`,
            () => handleDeviceDeletion(accessDeviceIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleOpenDeviceDialog = (mode: 'add' | 'edit', accessDeviceId?: string) => {
        setAccessDeviceDialogMode(mode);
        if (accessDeviceId) {
            const accessDeviceToEdit: UserPermission | undefined = userPermissions.find(accessDevice => accessDevice.id === accessDeviceId);
            setUserPermissionToEdit(accessDeviceToEdit);
        }
        setIsAddAccessDeviceModalVisible(true);
    };

    const getAccessDeviceName = (accessDevices: UserPermission[], accessDeviceId: string) => {
        const accessDeviceToDelete = accessDevices.find(accessDevice => accessDevice.id === accessDeviceId);
        const accessDeviceToDeleteName: string = accessDeviceToDelete !== undefined ? accessDeviceToDelete.name : '';
        return accessDeviceToDeleteName;
    };

    const headCells: headCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Bezeichnung der Berechtigung',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Beschreibung',
            isSortable: false,
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
                        handleMultipleDeviceDeletion(selected)
                    }}
                    addFunction={() => {
                        handleOpenDeviceDialog('add')
                    }}
                    tableHeading="Benutzer Berechtigungen verwalten"
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
                            rowCount={userPermissions.length}
                        />
                        <TableBody>
                            {stableSort(userPermissions, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((userPermission: UserPermission, index: number) => {
                                    const isItemSelected = isSelected(userPermission.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={userPermission.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, userPermission.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {userPermission.name}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {userPermission.description}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleOpenDeviceDialog('edit', userPermission.id)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSingleDeviceDeletion(userPermission.id)
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
                    count={userPermissions.length}
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
            <AddUserPermissionsDialog
                mode={accessDeviceDialogMode}
                userPermission={userPermissionToEdit}
                onDialogSuccess={onAddAccessDeviceDialogSuccess}
                onDialogFailure={onAddAccessDeviceDialogFailure}
                isOpen={isAddAccessDeviceModalVisible}
                onClose={() => {
                    setIsAddAccessDeviceModalVisible(false)
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

export default UserPermissions;