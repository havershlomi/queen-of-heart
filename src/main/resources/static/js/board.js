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
var dummyCards = [];
for (var i = 0; i < 52; i++) {
    dummyCards.push({"i": i, cardName: "Cblue_back"});
}
export default function Board(props) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);

    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    function cardUpdate(message) {
        var body = JSON.parse(message.body);
        var data = JSON.parse(body.data);

        if (body.command === "CardDraw") {
            var cardId = data.cardId;
            var selectedCard = data.selectedCard;
            // card[0].className = getCardName(selectedCard.value, selectedCard.type);
            var cardName = getCardName(selectedCard.value, selectedCard.type);
            // cardsRef2.current[cardId].cardName = cardName;
            let newCards = cardsRef.current.slice();
            newCards[cardId] = Object.assign({}, newCards[cardId]);
            newCards[cardId].cardName = cardName;
            setCards(newCards);
        }
    }

    if (!isConnected) {
        setCards(dummyCards);
        stompClient.register([
            {route: '/topic/draw', callback: cardUpdate},
        ]);
        setIsConnected(true);
    }

    return (
        <div className="board">
            {cards.map(card => {
                return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}/>)
            })}
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