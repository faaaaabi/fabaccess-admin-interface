import React, {useEffect, useState} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {IconButton, Paper, Table, TableBody, TableCell, TablePagination, TableRow, Tooltip, Chip, Avatar} from "@material-ui/core";
import EnhancedTableToolbar from "../../components/EnhancedTableToolbar";
import EnhancedTableHead from "../../components/EhancedTableHead";
import {getSorting, stableSort} from "../../utils/sorting";
import CancelIcon from '@material-ui/icons/Cancel';
import DeveloperBoardItem from '@material-ui/icons/DeveloperBoard';
import {Booking, ConfirmationDialogState} from "./types";
import {useSnackbar} from 'notistack';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useStyles from "./styles";
import {headCell} from "../../components/EhancedTableHead/types";
import {BookingService} from "../../service/BookingService";
import moment from "moment";

const Bookings: React.FC = () => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [bookings, setBookings] = React.useState<Booking[]>([]);
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

    const dispatch = useDispatch();
    const pageTitle = 'Aktive Buchungen';

    const bookingService = new BookingService();

    const fetchBookingsToState = async () => {
        const bookings = await bookingService.getAllBookings();
        setBookings(bookings);
    };

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
    }, [dispatch]);


    useEffect(() => {
        fetchBookingsToState();
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
            const newSelecteds = bookings.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.SyntheticEvent) => {
        const input = event.target as HTMLInputElement;
        setRowsPerPage(+input.value);
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, bookings.length - page * rowsPerPage);

    const endBooking = async (bookingId: string | string[]): Promise<void> => {
        await bookingService.endBooking(bookingId);
        await fetchBookingsToState();
        setSelected([]);
    };

    const handleConfirmation = (heading: string, confirmationText: string, agreeAction: Function, disagreeAction: Function) => {
        setConfirmationDialogState({heading, confirmationText, agreeAction, disagreeAction});
    };

    const handleEndBooking = (bookingId: string | string[]) => {
        endBooking(bookingId);
        setIsConfirmationDialogVisible(false);
        enqueueSnackbar('Buchung wurde erfolgreich beendet', {variant: 'success'});
    };

    const handleEndBookingConfirmation = (bookingId: string) => {
        const bookingUserName = getBookingUserName(bookings, bookingId);
        handleConfirmation('Buchung wirklich beenden?',
            `Möchtest Du die Buchung von "${bookingUserName}" wirklich beenden?`,
            () => handleEndBooking(bookingId),
            () => setIsConfirmationDialogVisible(false)
        );
        setIsConfirmationDialogVisible(true);
    };

    const getBookingUserName = (booking: Booking[], bookingId: string) => {
        const bookingToDelete = booking.find(booking => booking.id === bookingId);
        return bookingToDelete !== undefined ? bookingToDelete.userName : '';
    };

    const headCells: headCell[] = [
        {
            id: 'machineName',
            numeric: false,
            disablePadding: false,
            label: 'Maschine',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'userName',
            numeric: false,
            disablePadding: true,
            label: 'Benutzer',
            isSortable: true,
            align: 'left'
        },
        {
            id: 'startedAt',
            numeric: true,
            disablePadding: true,
            label: 'Buchung läuft seit',
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
                    tableHeading="Aktive Buchungen verwalten"
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
                            rowCount={bookings.length}
                        />
                        <TableBody>
                            {stableSort(bookings, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((booking: Booking, index: number) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    const bookingStartedAtDate = moment.unix(booking.startedAt).format("DD.MM.YY HH:mm:ss");
                                    const bookingStartedMinsAgo = moment.unix(booking.startedAt).diff(moment(), 'minutes');
                                    const userInitials = `${booking.userName.split(' ')[0].charAt(0)}${booking.userName.split(' ')[1].charAt(0)}`;
                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={booking.id}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" padding="default">
                                                <Chip
                                                    avatar={<Avatar><DeveloperBoardItem /></Avatar>}
                                                    label={booking.machineName}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <Chip
                                                    avatar={<Avatar>{userInitials}</Avatar>}
                                                    label={booking.userName}
                                                    clickable={true}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                <Tooltip title={`gestartet: ${bookingStartedAtDate}`}>
                                                    <div>{`${bookingStartedMinsAgo} Minuten`}</div>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Buchung Beenden">
                                                    <IconButton
                                                        className={classes.button}
                                                        aria-label="delete"
                                                        onClick={() => {
                                                            handleEndBookingConfirmation(booking.id)
                                                        }}
                                                    >
                                                        <CancelIcon/>
                                                    </IconButton>
                                                </Tooltip>
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
                    count={bookings.length}
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

export default Bookings;