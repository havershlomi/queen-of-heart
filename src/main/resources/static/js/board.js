import React from 'react';
import Card from './card';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import MySnackbarContentWrapper from "./snack-bar";

const stompClient = require('./websocket-listener');
var dummyCards = [];
for (var i = 0; i < 52; i++) {
    dummyCards.push({"i": i, cardName: "Cblue_back", selected: false});
}
export default function Board(props) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [isOpenBottom, setIsOpenBottom] = React.useState(false);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);
    const [infoMessage, setInfoMessage] = React.useState("");
    const [topInfoMessage, setTopInfoMessage] = React.useState("");

    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    function cardUpdate(response) {
        var body = JSON.parse(response.body);
        var data = JSON.parse(body.data);

        if (body.command === "CardDraw") {
            let cardId = data.cardId;
            let selectedCard = data.selectedCard;
            let cardName = getCardName(selectedCard.value, selectedCard.type);
            let newCards = cardsRef.current.slice();
            newCards[cardId] = Object.assign({}, newCards[cardId]);
            newCards[cardId].cardName = cardName;
            newCards[cardId].selected = true;
            setCards(newCards);
            let player = data.player;
            updateMessage("bottom", player.name + " drawed the: " + selectedCard.valueName + " of " + selectedCard.type);
        } else if (body.command === "TakeOne") {
            let player = data.player;
            updateMessage("top", "It's " + player.name + "'s turn now.");

        } else if (body.command === "TakeTwo") {
            let player = data.player;
            updateMessage("top", player.name + "needs to pick 2 cards" +
                " now.");
        }
    }

    if (!isConnected) {
        setCards(dummyCards);
        stompClient.register([
            {route: '/topic/draw', callback: cardUpdate},
        ]);
        setIsConnected(true);
    }

    const handleCloseInfoMessage = (type, event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (type == "bottom") {
            setIsOpenBottom(false);
        } else {
            setIsOpenTop(false);
        }
    };

    const updateMessage = (type, message) => {
        if (type == "bottom") {
            setInfoMessage(message);
            setIsOpenBottom(true);
        } else {
            setTopInfoMessage(message);
            setIsOpenTop(true);
        }
    };

    return (
        <div className="board-container">
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={isOpenTop}
                autoHideDuration={3000}
                onClose={(e, r) => (handleCloseInfoMessage("top", e, r))}
            >
                <MySnackbarContentWrapper
                    onClose={(e, r) => (handleCloseInfoMessage("top", e, r))}
                    variant="info"
                    message={topInfoMessage}
                />
            </Snackbar>
            <div className="board">
                {cards.map(card => {
                    return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}
                                  selected={card.selected}/>)
                })}

            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={isOpenBottom}
                autoHideDuration={2000}
                onClose={(e, r) => (handleCloseInfoMessage("bottom", e, r))}
            >
                <MySnackbarContentWrapper
                    onClose={(e, r) => (handleCloseInfoMessage("bottom", e, r))}
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