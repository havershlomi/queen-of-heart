import React from 'react';


export default function Card(props) {
    const [open, setOpen] = React.useState(false);
    const [fields, setFields] = React.useState({})
    const [objState, setObjState] = React.useState({});


    return (
        <div className="card test" onClick={() => props.drawFunc(props.cardId)}>
        </div>
    );
}