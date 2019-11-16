import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {Checkbox, IconButton, Paper, Table, TableBody, TableCell, TablePagination, TableRow} from "@material-ui/core";
import EnhancedTableToolbar from "../../../../components/EnhancedTableToolbar";
import EnhancedTableHead from "../../../../components/EhancedTableHead";
import {getSorting, stableSort} from "../../../../utils/sorting";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {Place, ConfirmationDialogState} from "../../types";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../../../components/EhancedTableHead/types";
import useTheme from "@material-ui/core/styles/useTheme";
import {PlacesService} from "../../../../service/PlacesService";
import {useHistory} from "react-router-dom";

const PlacesOverview: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [places, setPlaces] = React.useState<Place[]>([]);
    const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogState>({
        heading: '',
        confirmationText: '',
        agreeAction: () => {
        },
        disagreeAction: () => {
        }
    });
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    const dispatch = useDispatch();
    const pageTitle = 'Orte verwalten';

    const placesService = new PlacesService();

    const fetchPlacesToState = async () => {
        const places = await placesService.getAllPlaces();
        setPlaces(places);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchPlacesToState();
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
            const newSelecteds = places.map((n) => n.id);
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, places.length - page * rowsPerPage);

    const deleteUserPlaces = async (userPermissionId: string | string[]): Promise<void> => {
        await placesService.deletePlaces(userPermissionId);
        await fetchPlacesToState();
        setSelected([]);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handlePlacesDeletion = (placesId: string | string[]) => {
        deleteUserPlaces(placesId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Ort(e) wurde(n) erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSinglePlacesDeletion = (placesId: string) => {
        const PlacesToDeleteName = getPlacesName(places, placesId);
        handleConfirmation('Ort wirklich löschen?',
            `Möchtest Du den Ort "${PlacesToDeleteName}" wirklich löschen?`,
            () => handlePlacesDeletion(placesId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultiplePlacesDeletion = (placesIdsToDelete: string[]) => {
        const areAllPlacessSelected = placesIdsToDelete.length === places.length;
        const PlacesNamesToDelete = areAllPlacessSelected
            ? 'ALLE Orte'
            : `die Orte "${places.filter(place => placesIdsToDelete.indexOf(place.id) !== -1)
                .map(place => place.name)
                .join(', ')}"`;

        handleConfirmation('Ort wirklich löschen?',
            `Möchtest Du wirklich ${PlacesNamesToDelete} löschen?`,
            () => handlePlacesDeletion(placesIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const getPlacesName = (userPermission: Place[], userPermissionID: string) => {
        const userPermissionToDelete = userPermission.find(userPermission => userPermission.id === userPermissionID);
        return userPermissionToDelete !== undefined ? userPermissionToDelete.name : '';
    };

    const headCells: headCell[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name des Ortes',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'numMaschines',
            numeric: false,
            disablePadding: true,
            label: '# Maschinen',
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
                        handleMultiplePlacesDeletion(selected)
                    }}
                    addFunction={() => {
                        history.push('/places/create')
                    }}
                    tableHeading="Orte"
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
                            rowCount={places.length}
                            isSelectableTable={true}
                        />
                        <TableBody>
                            {stableSort(places, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((place: Place, index: number) => {
                                    const isItemSelected = isSelected(place.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={place.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, place.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {place.name}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {place.assignedMachineIds.length}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => history.push(`/places/edit/${place.id}`)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSinglePlacesDeletion(place.id)
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
                    count={places.length}
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

export default PlacesOverview;