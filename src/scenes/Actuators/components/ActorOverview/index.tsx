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
import ActorDialog from "../ActorDialog";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../../../components/EhancedTableHead/types";
import useTheme from "@material-ui/core/styles/useTheme";
import {ActuatorService} from "../../../../service/ActuatorService";
import { useHistory } from "react-router-dom";
import PowerIcon from '@material-ui/icons/Power';

const ActorOverview: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [actors, setActors] = React.useState<Actuator[]>([]);
    const [isActorDialogVisible, setIsActorDialogVisible] = React.useState<boolean>(false);
    const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogState>({
        heading: '',
        confirmationText: '',
        agreeAction: () => {
        },
        disagreeAction: () => {
        }
    });
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
    const [actorToEdit, setActorToEdit] = useState<Actuator | undefined>(undefined);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const dispatch = useDispatch();
    const pageTitle = 'Aktoren verwalten';

    const actorService = new ActuatorService();

    const fetchActorsToState = async () => {
        const actors = await actorService.getAllactuators();
        setActors(actors);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchActorsToState();
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
            const newSelecteds = actors.map((n) => n.id);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, actors.length - page * rowsPerPage);

    const deleteUserActor = async (userPermissionId: string | string[]): Promise<void> => {
        await actorService.deleteActuators(userPermissionId);
        await fetchActorsToState();
        setSelected([]);
    };

    const onEditActorDialogSuccess = async () => {
        enqueueSnackbar('Der Aktor wurde erfolgreich geändert', {variant: 'success'});
        setIsActorDialogVisible(false);
        setActorToEdit(undefined);
        await fetchActorsToState();
    };

    const onEditDialogFailure = () => {
        enqueueSnackbar('Fehler beim Ändern des Aktors', {variant: 'warning'});
        setActorToEdit(undefined);
        setIsActorDialogVisible(false);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleActorDeletion = (actorId: string | string[]) => {
        deleteUserActor(actorId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Aktor(en) wurde(n) erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSingleActorDeletion = (actorId: string) => {
        const ActorToDeleteName = getActorName(actors, actorId);
        handleConfirmation('Aktor wirklich löschen?',
            `Möchtest Du den Aktor "${ActorToDeleteName}" wirklich löschen?`,
            () => handleActorDeletion(actorId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultipleActorDeletion = (actorIdsToDelete: string[]) => {
        const areAllActorsSelected = actorIdsToDelete.length === actors.length;
        const ActorNamesToDelete = areAllActorsSelected
            ? 'ALLE Aktoren'
            : `die Aktoren "${actors.filter(userPermission => actorIdsToDelete.indexOf(userPermission.id) !== -1)
                .map(userPermission => userPermission.name)
                .join(', ')}"`;

        handleConfirmation('Aktor wirklich löschen?',
            `Möchtest Du wirklich die Aktoren ${ActorNamesToDelete} löschen?`,
            () => handleActorDeletion(actorIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleOpenDeviceDialog = (userPermissionId?: string) => {
        const userPermissionToEdit: Actuator | undefined = actors.find(userPermission => userPermission.id === userPermissionId);
        setActorToEdit(userPermissionToEdit);
        setIsActorDialogVisible(true);
    };

    const getActorName = (userPermission: Actuator[], userPermissionID: string) => {
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
            align: 'center'
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            isSortable: true,
            align: 'center'
        },
        {id: 'actions', numeric: false, disablePadding: true, label: 'Aktionen', isSortable: false, align: 'center'}
    ];

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    deleteFunction={() => {
                        handleMultipleActorDeletion(selected)
                    }}
                    addFunction={() => {
                        history.push('/actors/create')
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
                            rowCount={actors.length}
                            isSelectableTable={true}
                        />
                        <TableBody>
                            {stableSort(actors, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((actor: Actuator, index: number) => {
                                    const isItemSelected = isSelected(actor.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={actor.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, actor.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {actor.name}
                                            </TableCell>
                                            <TableCell align="left" component="th" id={labelId} scope="row" padding="none">
                                                {actor.system}
                                            </TableCell>
                                            <TableCell align="left" component="th" id={labelId} scope="row" padding="none">
                                                <Chip
                                                    icon={<PowerIcon />}
                                                    label={actor.type === 'switch' ? 'Schalter' : actor.type}
                                                />
                                            </TableCell>
                                            <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                                                <Chip
                                                    color={getStatusColor(actor.status)}
                                                    label={actor.status}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleOpenDeviceDialog(actor.id)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSingleActorDeletion(actor.id)
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
                    count={actors.length}
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
            <ActorDialog
                actor={actorToEdit}
                onDialogSuccess={onEditActorDialogSuccess}
                onDialogFailure={onEditDialogFailure}
                isOpen={isActorDialogVisible}
                onClose={() => {
                    setIsActorDialogVisible(false)
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

export default ActorOverview;