import React from 'react';
import Card from './card';
import {getPlayer} from './utils';

export default function Board(props) {
    const [playerName, setPlayerName] = React.useState(null);
    //TODO: get player name here

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
                <span>Hi, {playerName}</span>
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
