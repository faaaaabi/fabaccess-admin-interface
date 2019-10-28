import {makeStyles, Theme} from "@material-ui/core/styles";

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
        minWidth: 400,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing(0),
    }
}));

export default useStyles;