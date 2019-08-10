import React from 'react';
import Card from './card';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import MySnackbarContentWrapper from "./snack-bar";

const stompClient = require('./websocket-listener');
var dummyCards = [];
for (var i = 0; i < 52; i++) {
    dummyCards.push({"i": i, cardName: "Cblue_back"});
}
export default function Board(props) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);
    const [infoMessage, setInfoMessage] = React.useState("");

    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    function cardUpdate(response) {
        var body = JSON.parse(response.body);
        var data = JSON.parse(body.data);

        if (body.command === "CardDraw") {
            var cardId = data.cardId;
            var selectedCard = data.selectedCard;
            var cardName = getCardName(selectedCard.value, selectedCard.type);
            let newCards = cardsRef.current.slice();
            newCards[cardId] = Object.assign({}, newCards[cardId]);
            newCards[cardId].cardName = cardName;
            setCards(newCards);

            let player = data.player;

            updateMessage(player.name + " drawed the: " + selectedCard.valueName + " of " + selectedCard.type);
        }
    }

    if (!isConnected) {
        setCards(dummyCards);
        stompClient.register([
            {route: '/topic/draw', callback: cardUpdate},
        ]);
        setIsConnected(true);
    }

    const handleCloseInfoMessage = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsOpen(false);
    };

    const updateMessage = (message) => {
        setInfoMessage(message);
        setIsOpen(true);
    };

    return (
        <div className="board-container">
            <div className="board">
                {cards.map(card => {
                    return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}/>)
                })}

            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={isOpen}
                autoHideDuration={3000}
                onClose={handleCloseInfoMessage}
            >
                <MySnackbarContentWrapper
                    onClose={handleCloseInfoMessage}
                    variant="info"
                    message={infoMessage}
                />
            </Snackbar>
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