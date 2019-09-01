import React from 'react';
import Card from './card';

export default function Board(props) {
    const [playerName, setPlayerName] = React.useState("name here");
    //TODO: get player name here

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
