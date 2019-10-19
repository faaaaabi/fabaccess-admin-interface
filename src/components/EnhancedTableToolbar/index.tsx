import React from "react";
import Props from "./types";
import {IconButton, Theme, Toolbar, Tooltip, Typography, Button} from "@material-ui/core";
import clsx from "clsx";
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from "@material-ui/core/styles";
import {lighten} from "@material-ui/core/styles";

const useToolbarStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
    button: {
        margin: theme.spacing(1),
    },
}));

const EnhancedTableToolbar: React.FC<Props> = (props: Props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} ausgewählt
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {props.tableHeading}
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete" onClick={() => props.deleteFunction()}>
                        <IconButton aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={(event: React.SyntheticEvent<HTMLElement>) => {props.addFunction(event) }}
                        >
                            Anlegen
                        </Button>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

export default EnhancedTableToolbar;