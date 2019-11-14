import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    },
    select: {
        width: '200px'
    },
    addableActorList: {
        minWidth: '300px',
    },
    textField: {
      width: '400px',
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export default useStyles;