import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2)
    },
    containerGridItem: {
        width: 'fit-content'
    },
    textField: {
        width: '100%',
    },
    table: {
        minWidth: 650,
    },
    button: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        float: 'right',
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    box: {
        background: '#fff',
        border: '1px solid #999',
        borderRadius: '3px',
        width: '100px',
        height: '100px',
        fontSize: '80%',
        margin: '10px',
        padding: '10px',
        float: 'left',
    },
    boxHighlighted: {
        backgroundColor: 'c3c3c3',
        border: '1px solid #999',
        borderRadius: '3px',
        width: '100px',
        height: '100px',
        fontSize: '80%',
        margin: '10px',
        padding: '10px',
        float: 'left',
    },
}));

export default useStyles;