import React, {useState, useEffect} from 'react';


export default function Card(props) {

    return (
        <div className={"card " + props.cardName} onClick={() => props.drawFunc(props.cardId)}>
        </div>
    );
}