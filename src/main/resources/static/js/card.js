import React, {useState, useEffect} from 'react';


export default function Card(props) {


    return (
        <div className={props.cardName + "card"} cardName={props.cardName} onClick={() => props.drawFunc(props.cardId)}>
        </div>
    );
}