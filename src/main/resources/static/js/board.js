import React from 'react';
import Card from './card';
import {getPlayer} from './utils';

export default function Board(props) {
    const [playerName, setPlayerName] = React.useState(null);
    let currentPlayer = !props.currentPlayer ? {"name": ""} : props.currentPlayer;

    if (playerName === null) {
        getPlayer(props.me).then(response => {
            if (response.status === 200) {
                if (response.data.message === "OK") {
                    setPlayerName(response.data.body.name);
                }
            }
        });
    }

    return (
        <div className="board-container">
            <div className="header">
                <label
                    className={"turn-label"}>{(props.me === currentPlayer["id"]) ? "Your turn" : "Turn " + currentPlayer["name"]}</label>
                <span>Hi, {playerName}</span>
                <Card key={props.lastCard} cardId={props.lastCard} cardName={props.lastCard}
                      selected={true}/>
            </div>
            <div className="board">
                {props.deck.map(card => {
                    return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}
                                  selected={card.selected}/>)
                })}

            </div>
        </div>
    );
}
