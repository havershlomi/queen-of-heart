import React from 'react';
import Card from './card';

export default function Board(props) {
    let currentPlayer = !props.currentPlayer ? {"name": ""} : props.currentPlayer;

    return (
        <div className="board-container">
            <div className="header">
                <label
                    className={"turn-label"}>{(props.me.current === currentPlayer["id"]) ? "Your turn" : "Turn: " + currentPlayer["name"]}</label>
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
