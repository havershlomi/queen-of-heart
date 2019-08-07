import React from 'react';
import Card from './card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Board(props) {
    const [open, setOpen] = React.useState(false);
    const [fields, setFields] = React.useState({})
    const [objState, setObjState] = React.useState({});

    function handleClose(isConfirm) {
        if (isConfirm) {
            props.confirmedAction(objState).then(response => {
                if (response.status) {
                    setOpen(false);
                } else {
                    console.log("error");
                }
            });

        } else {
            setOpen(false);
        }
    }

    const handleChange = (e) => {
        const obj = objState;
        obj[e.target.id] = e.target.value;
        setObjState(obj);
    };

    const cards = [];
    for (var i = 0; i < 52; i++) {
        cards.push(<Card key={i.toString()} cardId={i} drawFunc={props.drawCard}/>);
    }
    return (
        <div className="board">
            {cards}
        </div>
    );
}