import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MySnackbarContentWrapper from "./snack-bar";
import Snackbar from '@material-ui/core/Snackbar';


export default function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [objState, setObjState] = React.useState({});
    const [openErrorMessage, setOpenErrorMessage] = React.useState(false);


    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose(isConfirm) {
        if (isConfirm) {
            setMessage("");
            props.confirmedAction(objState).then(response => {
                if (response.status) {
                    setOpen(false);
                } else {
                    console.log("error");
                }
            }).catch(response => {
                setMessage(response);
                setOpenErrorMessage(true);
            });

        } else {
            setOpen(false);
        }
    }

    function handleCloseErrorMessage(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorMessage(false);
    }

    const handleChange = (e) => {
        const obj = objState;
        obj[e.target.id] = e.target.value;
        setObjState(obj);
    };

    const inputs = props.attributes.map(attribute =>
        <div key={attribute.toLowerCase()}>
            <TextField
                autoFocus
                margin="dense"
                id={attribute.toLowerCase()}
                label={attribute}
                type="text"
                onChange={handleChange}
                fullWidth
            />
        </div>
    );

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                {props.buttonName}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.header}</DialogTitle>
                <DialogContent>
                    {inputs}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary">
                        {props.cancelButton ? props.cancelButton : "Cancel"}
                    </Button>
                    <Button onClick={() => handleClose(true)} color="primary">
                        {props.confirmButton}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={openErrorMessage}
                autoHideDuration={3000}
                onClose={handleCloseErrorMessage}
            >
                <MySnackbarContentWrapper
                    onClose={handleCloseErrorMessage}
                    variant="error"
                    message={message}
                />
            </Snackbar>
        </div>
    );
}