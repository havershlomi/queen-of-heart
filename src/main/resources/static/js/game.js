import Snackbar from "@material-ui/core/Snackbar/Snackbar";

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import Board from "./board";
import Player from "./player";
import FormDialog from "./material-dialog";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'
// import Cookies from 'js-cookie';
import Cookies from 'universal-cookie';
import MySnackbarContentWrapper from "./snack-bar";

const stompClient = require('./websocket-listener');
var dummyCards = [];


export default function Game(props) {
    const [isConnected, setIsConnected] = React.useState(false);
    const [isDeckUpdated, setIsDeckUpdated] = React.useState(false);
    let [gameId, setGameId] = React.useState(null);
    let [playerId, setPlayerId] = React.useState(null);
    const [isOpenBottom, setIsOpenBottom] = React.useState(false);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);
    const [infoMessage, setInfoMessage] = React.useState("");
    const [topInfoMessage, setTopInfoMessage] = React.useState("");

    const cookies = new Cookies();
    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    const values = queryString.parse(window.location.search);

    if (gameId === null) {
        gameId = parseInt(values.game, 10);
        if (!isIntValid(gameId)) {
            props.history.push("/?msg=invalid_game");
        } else {
            setGameId(gameId);
        }
    }

    function isIntValid(id) {
        if (isNaN(id) || id <= 0)
            return false;
        return true;
    }

    if (playerId === null && values.msg === undefined) {
        //TODO: get this information from cookie
        // let player = parseInt(cookies.get('q_player'), 10);
        playerId = parseInt(values.player, 10);

        if (!isIntValid(playerId)) {
            props.history.push("/player?game=" + gameId + "&msg=invalid_player");
            return;
        } else {
            setPlayerId(playerId);
        }
    }

    if (isDeckUpdated === false) {
        //get the deck from server
        for (var i = 0; i < 52; i++) {
            dummyCards.push({"i": i, cardName: "Cblue_back", selected: false});
        }
        setCards(dummyCards);
        setIsDeckUpdated(true)
    }

    if (!isConnected) {
        setCards(dummyCards);
        stompClient.register([
            {route: '/topic/draw', callback: cardUpdate},
        ]);
        setIsConnected(true);
    }

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

    const updateMessage = (type, message) => {
        if (type == "bottom") {
            setInfoMessage(message);
            setIsOpenBottom(true);
        } else {
            setTopInfoMessage(message);
            setIsOpenTop(true);
        }
    };


    function drawCard(cardId) {
        const pResponse = axios({
            method: "POST",
            url: '/card/draw',
            params: {playerId: playerId, gameId: gameId, cardId: cardId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                if (response.command === "Error") {

                }
                return {status: true, data: response.data};
            }
            return {status: false, data: response.data};
        });

        return pResponse;
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

    return (
        //TODO:: pass deck here
        <div>
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
            <Board drawCard={drawCard} deck={cards} me={playerId}/>
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
    )
};



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