import React from 'react';
import Card from './card';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import MySnackbarContentWrapper from "./snack-bar";


export default function Board(props) {
    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);



    return (
        <div className="board-container">

            <div className="board">
                {props.deck.map(card => {
                    return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}
                                  selected={card.selected}/>)
                })}

            </div>

        </div>
    );
}
