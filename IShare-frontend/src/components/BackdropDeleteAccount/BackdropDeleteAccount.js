import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    buttonDelete: {
        background: theme.palette.error.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.error.dark
        }
    }
}));

export default function FormDialog(props) {
    const classes = useStyles()
    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Are you sure ?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You are going to remove PERMANENTLY your account, are you sure this is what you want ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} variant='outlined' >
                        Cancel
                    </Button>
                    <Button onClick={props.handleDeleteMyAccount} variant='contained' className={classes.buttonDelete}>
                        I'm sure, delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}