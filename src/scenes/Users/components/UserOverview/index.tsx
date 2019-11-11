import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {Checkbox, IconButton, Paper, Table, TableBody, TableCell, TablePagination, TableRow} from "@material-ui/core";
import EnhancedTableToolbar from "../../../../components/EnhancedTableToolbar";
import EnhancedTableHead from "../../../../components/EhancedTableHead";
import {getSorting, stableSort} from "../../../../utils/sorting";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import {ConfirmationDialogState} from "./types";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../../../components/EhancedTableHead/types";
import {UserService} from "../../../../service/UserService/UserService";
import {useHistory} from "react-router";
import {UserDTO} from "../UserForm/types";
import User from "../../../../service/UserService/types/User";
import SearchBar from 'material-ui-search-bar';
import Fuse from "fuse.js";

const UserOverview: React.FC = () => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [users, setUsers] = React.useState<UserDTO[]>([]);
    const [visibleUsers, setVisibleUsers] = React.useState<UserDTO[]>([]);
    const [confirmationDialogState, setConfirmationDialogState] = useState<ConfirmationDialogState>({
        heading: '',
        confirmationText: '',
        agreeAction: () => {
        },
        disagreeAction: () => {
        }
    });
    const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [fuseSearchIndex, setFuseSearchIndex] = useState();
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();


    const dispatch = useDispatch();
    const pageTitle = 'Benutzer verwalten';

    const userService = new UserService();

    const fetchUsersToState = async () => {
        const users = await userService.getAllUsers();
        setUsers(users);
        setVisibleUsers(users);
        initalizeFuseSearchIndex(users);
    };

    const initalizeFuseSearchIndex = (users: UserDTO[]) => {
        const fuseOptions = {
            shouldSort: true,
            threshold: 0.5,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "firstName",
                "lastName",
                "emailAddress"
            ]
        };
        const fuseSearchIndex = new Fuse(users, fuseOptions);
        setFuseSearchIndex(fuseSearchIndex);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchUsersToState();
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
            const newSelecteds = users.map((user) => {
                return user.id ? user.id : '';
            });
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

    const deleteUsers = async (userId: string | string[]): Promise<void> => {
        await userService.deleteUsers(userId);
        await fetchUsersToState();
        setSelected([]);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleUserDeletion = async (userId: string | string[]) => {
        await deleteUsers(userId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Benutzer wurde(n) erfolgreich gelöscht', {variant: 'success'});
    };

    const handleSingleUserDeletion = (userId: string) => {
        const userToDeleteName = getUserName(users, userId);
        handleConfirmation('Benutzer wirklich löschen?',
            `Möchtest Du den Benutzer "${userToDeleteName}" wirklich löschen?`,
            () => handleUserDeletion(userId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleMultipleUserDeletion = (userIdsToDelete: string[]) => {
        const areAllDevicesSelected = userIdsToDelete.length === users.length;
        const userNamesToDelete = areAllDevicesSelected
            ? 'ALLE Benutzer'
            : `die Benutzer "${users.filter(user => userIdsToDelete.indexOf(user.id ? user.id : '') !== -1)
                .map(user => `${user.firstName} ${user.lastName}`)
                .join(', ')}"`;

        handleConfirmation('Benutzer wirklich löschen?',
            `Möchtest Du wirklich ${userNamesToDelete} löschen?`,
            () => handleUserDeletion(userIdsToDelete),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const handleSearchQueryChange = (searchQuery: string) => {
        setSearchQuery(searchQuery);
        if(searchQuery === '') {
            setVisibleUsers(users);
        } else {
            setVisibleUsers(fuseSearchIndex.search(searchQuery))
        }
    };

    const getUserName = (users: UserDTO[], userID: string) => {
        const userToDelete = users.find(user => user.id === userID);
        return userToDelete !== undefined ? `${userToDelete.firstName} ${userToDelete.lastName}` : '';
    };

    const headCells: headCell[] = [
        {
            id: 'firstName',
            numeric: false,
            disablePadding: true,
            label: 'Vorname',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'lastName',
            numeric: false,
            disablePadding: true,
            label: 'Nachname',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'emailAddress',
            numeric: false,
            disablePadding: true,
            label: 'E-Mail Adresse',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'isAdmin',
            numeric: false,
            disablePadding: true,
            label: 'Ist Admin',
            isSortable: true,
            align: 'center'
        },
        {id: 'actions', numeric: false, disablePadding: true, label: 'Aktionen', isSortable: false, align: 'center'}
    ];

    return (
        <div className={classes.root}>
            <SearchBar
                onChange={(newValue) => handleSearchQueryChange(newValue)}
                value={searchQuery}
                onRequestSearch={() => console.log('onRequestSearch')}
                onCancelSearch={() => handleSearchQueryChange('')}
                placeholder='Suche: Vorname, Nachname oder E-Mail-Adresse'
                style={{
                    margin: '0 auto',
                    width: '100%',
                    marginBottom: '14px'
                }}
            />
            <Paper className={classes.paper}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    deleteFunction={() => {
                        handleMultipleUserDeletion(selected)
                    }}
                    addFunction={() => {
                        history.push('/users/create')
                    }}
                    tableHeading="Benutzer"
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
                            rowCount={users.length}
                            isSelectableTable={true}
                        />
                        <TableBody>
                            {stableSort(visibleUsers, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user: User, index: number) => {
                                    const isItemSelected = isSelected(user.id ? user.id : '');
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={user.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleSingleSelection(event, user.id ? user.id : '')}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {user.firstName}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {user.lastName}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {user.emailAddress}
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none"
                                                       align="center">
                                                {user.isAdmin ? (
                                                    <CheckCircleIcon color="primary"/>
                                                ) : (
                                                    <></>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="edit"
                                                    onClick={() => history.push(`/users/${user.id}`)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    className={classes.button}
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        handleSingleUserDeletion(user.id ? user.id : '')
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
                    count={users.length}
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

export default UserOverview;