import React from 'react';

export default function Message(props) {

    return (
        <h1 style={{display: (props.message !== null ? "block" : "none")}}>{props.message} lost</h1>
    )
};
