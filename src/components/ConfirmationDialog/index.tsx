import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Props from "./types";

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationDialog: React.FC<Props> = (props: Props) => {


    const handleAgree = () => {
        props.agreeAction();
    };

    const handleDisagree = () => {
        props.disagreeAction();
    };

    return (
        <div>
            <Dialog
                open={props.isOpen}
                TransitionComponent={Transition}
                keepMounted={true}
                onClose={handleDisagree}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{props.heading}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {props.explainerText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree} color="primary">
                        Nein
                    </Button>
                    <Button onClick={handleAgree} color="primary">
                        Ja
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfirmationDialog
