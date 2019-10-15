import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {
    Checkbox,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import EnhancedTableToolbar from "./components/EnhancedTableToolbar";
import EnhancedTableHead from "../../components/EhancedTableHead";
import {getSorting, stableSort} from "./components/helperFunctions/sorting";
import {AccessDeviceService} from "../../service/AccessDeviceService";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {AccessDevice, ConfirmationDialogState} from "./types";
import AddAccessDeviceDialog from "./components/AddAccessDeviceDialog";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../components/EhancedTableHead/types";
import Clipboard from 'react-clipboard.js';

const AccessDevices: React.FC = () => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [accessDevices, setAccessDevices] = React.useState<AccessDevice[]>([]);
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
    const [accessDeviceToEdit, setAccessDeviceToEdit] = useState<AccessDevice | undefined>(undefined);
    const {enqueueSnackbar} = useSnackbar();

    new AccessDeviceService();

    const dispatch = useDispatch();
    const pageTitle = 'Zugriffsgeräte';

    const accessDeviceService = new AccessDeviceService();

    const fetchAccessDevicesToState = async () => {
        const accessDevices = await accessDeviceService.getAllAccessDevices();
        setAccessDevices(accessDevices);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
    }, []);

    useEffect(() => {
        fetchAccessDevicesToState();
    }, []);

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            const newSelecteds = accessDevices.map((n) => n.id);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, accessDevices.length - page * rowsPerPage);

    const deleteAccessDevice = async (accessDeviceId: string | string[]): Promise<void> => {
        await accessDeviceService.deleteAccessDevices(accessDeviceId);
        await fetchAccessDevicesToState();
        setSelected([]);
    };

    const onAddAccessDeviceDialogSuccess = async () => {
        enqueueSnackbar('Das Zugriffsgerät wurde erfolgreich angelegt', {variant: 'success'});
        setIsAddAccessDeviceModalVisible(false);
        setAccessDeviceToEdit(undefined);
        await fetchAccessDevicesToState();
    };

    const onAddAccessDeviceDialogFailure = () => {
        enqueueSnackbar('Fehler beim anlegen des Zugriffsgeräts', {variant: 'warning'});
        setAccessDeviceToEdit(undefined);
        setIsAddAccessDeviceModalVisible(false);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleDeviceDeletion = (accessDeviceId: string | string[]) => {
        deleteAccessDevice(accessDeviceId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Zugriffsgerät(e) wurden erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSingleDeviceDeletion = (accessDeviceId: string) => {
        const accessDeviceToDeleteName = getAccessDeviceName(accessDevices, accessDeviceId);
        handleConfirmation('Zugriffsgerät wirklich löschen?',
            `Möchtest Du das Zugriffsgerät "${accessDeviceToDeleteName}" wirklich löschen?`,
            () => handleDeviceDeletion(accessDeviceId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultipleDeviceDeletion = (accessDeviceIdsToDelete: string[]) => {
        let deviceNamesToDelete = '';
        const areAllDevicesSelected = accessDeviceIdsToDelete.length === accessDevices.length;
        deviceNamesToDelete = areAllDevicesSelected
            ? 'ALLE'
            : accessDevices.filter(accessDevice => accessDeviceIdsToDelete.indexOf(accessDevice.id) !== -1)
                .map(accessDevice => accessDevice.name)
                .join(', ');

        handleConfirmation('Zugriffsgeräte wirklich löschen?',
            `Möchtest Du die Zugriffsgeräte ${deviceNamesToDelete} wirklich löschen?`,
            () => handleDeviceDeletion(accessDeviceIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleOpenDeviceDialog = (mode: 'add' | 'edit', accessDeviceId?: string) => {
        setAccessDeviceDialogMode(mode);
        if (accessDeviceId) {
            const accessDeviceToEdit: AccessDevice | undefined = accessDevices.find(accessDevice => accessDevice.id === accessDeviceId);
            setAccessDeviceToEdit(accessDeviceToEdit);
        }
        setIsAddAccessDeviceModalVisible(true);
    };


    const onCopyToClipboardSuccess = (accessDeviceName: string) => {
        enqueueSnackbar(`API Key von "${accessDeviceName}" wurde in die Zischenablage kopiert`, {variant: 'success'});
    };

    const getAccessDeviceName = (accessDevices: AccessDevice[], accessDeviceId: string) => {
        const accessDeviceToDelete = accessDevices.find(accessDevice => accessDevice.id === accessDeviceId);
        const accessDeviceToDeleteName: string = accessDeviceToDelete !== undefined ? accessDeviceToDelete.name : '';
        return accessDeviceToDeleteName;
    };

    const headCells: headCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name des Zugriffsgeräts',
            isSortable: true,
            align: 'left'
        },
        {id: 'apiKey', numeric: false, disablePadding: false, label: 'API Key', isSortable: false, align: 'left'},
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
                            rowCount={accessDevices.length}
                        />
                        <TableBody>
                            {stableSort(accessDevices, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((accessDevice: any, index: number) => {
                                    const isItemSelected = isSelected(accessDevice.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={accessDevice.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, accessDevice.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {accessDevice.name}

                                            </TableCell>
                                            <TableCell align="left">
                                                <TextField type="password"
                                                           variant="outlined"
                                                           value={accessDevice.apiKey}
                                                           disabled={true}
                                                           fullWidth={false}
                                                           InputProps={{
                                                               style: {
                                                                   fontSize: 14,
                                                               },
                                                               endAdornment: (
                                                                   <InputAdornment position="end">
                                                                       <Clipboard
                                                                           data-clipboard-text={accessDevice.apiKey}
                                                                           onSuccess={() => onCopyToClipboardSuccess(accessDevice.name)}
                                                                           style={{
                                                                               border: 'none',
                                                                               backgroundColor: 'transparent'
                                                                           }}
                                                                       >
                                                                           <IconButton
                                                                               edge="end"
                                                                               aria-label="Api Key in die Zwischenablage kopieren"
                                                                           >
                                                                               <FileCopyIcon fontSize='small'/>
                                                                           </IconButton>
                                                                       </Clipboard>
                                                                   </InputAdornment>
                                                               )
                                                           }}/>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton aria-label="delete"
                                                            onClick={() => handleOpenDeviceDialog('edit', accessDevice.id)}>
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSingleDeviceDeletion(accessDevice.id)
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
                    count={accessDevices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page',
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            <AddAccessDeviceDialog
                mode={accessDeviceDialogMode}
                accessDeviceToEdit={accessDeviceToEdit}
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

export default AccessDevices;