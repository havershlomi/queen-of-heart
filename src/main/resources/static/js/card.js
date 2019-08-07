import React from 'react';


export default function Card(props) {
    const [open, setOpen] = React.useState(false);
    const [fields, setFields] = React.useState({})
    const [objState, setObjState] = React.useState({});

    function handleClickOpen() {
        setOpen(true);
    }

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

    const cardStyle = {backgroundColor: "blue", width: "50px", height: "50px"};
    return (
        <div className="card">
        </div>
    );
}