import React from 'react';
import Card from './card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const stompClient = require('./websocket-listener');

export default function Board(props) {
    const [isConnected, setIsConnected] = React.useState(false);
    const cards = React.useRef([]);

    function cardUpdate(message) {
        debugger;
        var body = JSON.parse(message.body);
        var data = JSON.parse(body.data);

        if (body.command === "CardDraw") {
            var cardId = data.cardId;
            var selectedCard = data.selectedCard;
            //finding the right card for the change
            var card = cards.filter(i => i.key.toString() === cardId.toString());
            // card[0].className = getCardName(selectedCard.value, selectedCard.type);
            var cardName = getCardName(selectedCard.value, selectedCard.type);
            card[0] = React.cloneElement(card[0], {cardName: cardName, className: cardName})

            debugger;
        }
    }

    if (!isConnected) {
        stompClient.register([
            {route: '/topic/draw', callback: cardUpdate},
        ]);
        setIsConnected(true);
    }

    for (var i = 0; i < 52; i++) {
        cards.current.push(<Card key={i} cardId={i} cardName="" drawFunc={props.drawCard}/>);
    }
    return (
        <div className="board">
            {cards}
        </div>
    );
}


function getCardName(value, type) {
    switch (value) {
        case 0:
            value = "K";
            break;
        case 12:
            value = "Q";
            break;
        case 11:
            value = "J";
            break;
        case 1:
            value = "A";
            break;
        default:
            value = value.toString();
    }

    type = type.substr(0, 1);
    return "C" + value + type;
}