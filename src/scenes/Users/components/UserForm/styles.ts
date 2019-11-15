import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: theme.spacing(2),
    },
    paper: {
        width: '100%',
        padding: theme.spacing(2)
    },
    containerGridItem: {
        width: 'fit-content'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
    table: {
        minWidth: 650,
    },
    button: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
}));

export default useStyles;