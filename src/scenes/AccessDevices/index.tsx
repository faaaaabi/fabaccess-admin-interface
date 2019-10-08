import React, {useEffect} from "react";
import {SET_PAGE_TITLE} from "../../redux/navigation/types";
import {useDispatch} from "react-redux";
import {
    Checkbox,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Theme,
    IconButton
} from "@material-ui/core";
import EnhancedTableToolbar from "./components/EnhancedTableToolbar";
import EnhancedTableHead from "../../components/EhancedTableHead";
import {getSorting, stableSort} from "./components/helperFunctions/sorting";
import {AccessDeviceService} from "./service/AccessDeviceService";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {AccessDevice} from "./types";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    button: {
        margin: theme.spacing(0),
    },
}));

const AccessDevices: React.FC = () => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<('asc' | 'desc')>('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState<(string | undefined)[]>([]);
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [accessDevices, setAccessDevices] = React.useState<AccessDevice[]>([]);

    new AccessDeviceService();

    const dispatch = useDispatch();
    const pageTitle = 'Zugriffsgeräte';

    const accessDeviceService = new AccessDeviceService();

    useEffect(() => {
        const setPageTitle = (pageTitle: string) => {
            dispatch({type: SET_PAGE_TITLE, payload: pageTitle});
        };
        setPageTitle(pageTitle);
    }, []);

    useEffect(() => {
        const fetchData = () => {
            const accessDevices = accessDeviceService.getAllAccessDevices()
            setAccessDevices(accessDevices);
        };
        fetchData();
    }, []);

    const headCells = [
        {id: 'name', numeric: false, disablePadding: true, label: 'Name des Zugriffsgeräts'},
        {id: 'apiKey', numeric: false, disablePadding: false, label: 'API Key'},
        {id: 'actions', numeric: false, disablePadding: true, label: 'Aktionen'}
    ];

    const handleRequestSort = (event: React.SyntheticEvent, property: string) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.target as HTMLInputElement;
        if (input.checked) {
            const newSelecteds = accessDevices.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.SyntheticEvent, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: (string | undefined)[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
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

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, accessDevices.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar numSelected={selected.length}/>
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
                                    const isItemSelected = isSelected(accessDevice.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={true}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={accessDevice.name}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                    onClick={event => handleClick(event, accessDevice.name)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} scope="row" padding="none">
                                                {accessDevice.name}
                                            </TableCell>
                                            <TableCell align="left">{accessDevice.apiKey}</TableCell>
                                            <TableCell align="left">
                                                <IconButton aria-label="delete" onClick={() => console.log('edited')}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton className={classes.button} aria-label="delete" onClick={() => console.log('deleted')}>
                                                    <DeleteIcon />
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
        </div>
    );
};

export default AccessDevices;