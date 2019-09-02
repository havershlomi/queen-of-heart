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
import {isGameValid} from './utils';
const stompClient = require('./websocket-listener');

export default function Game(props) {
    let [gameId, setGameId] = React.useState(null);
    let [playerId, setPlayerId] = React.useState(null);
    const [currentPlayerId, setCurrentPlayerId] = React.useState(null);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isDeckUpdated, setIsDeckUpdated] = React.useState(false);
    let [isStarted, setIsStarted] = React.useState(true);

    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);

    //Messgaes
    const [isOpenBottom, setIsOpenBottom] = React.useState(false);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [infoMessage, setInfoMessage] = React.useState("");
    const [topInfoMessage, setTopInfoMessage] = React.useState("");

    const cookies = new Cookies();
    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    const values = queryString.parse(window.location.search);

    function isIntValid(id) {
        if (isNaN(id) || id <= 0)
            return false;
        return true;
    }

    if (gameId === null) {
        gameId = values.game;
        if (!isGameValid(gameId)) {
            props.history.push("/?msg=invalid_game");
        } else {
            setGameId(gameId);
            if (!isConnected) {
                stompClient.register([
                    {route: '/topic/' + gameId + '/draw', callback: cardUpdate},
                ]);
                setIsConnected(true);
            }
            axios({
                method: "POST",
                url: '/game/get',
                params: {gameId: gameId},
                headers: {'Content-Type': 'application/json; charset=utf-8"'}
            }).then(response => {
                    if (response.status === 200) {
                        if (response.data.message == "OK") {
                            if (response.data.body.status.toLowerCase().indexOf("inprogress") !== -1) {
                                setIsStarted(true);
                                isStarted = true;
                            } else {
                                props.history.push("/");
                            }
                        } else {
                            props.history.push("/");
                        }
                        return {status: true, data: response.data};
                    }
                    return {status: false, data: response.data};
                }
            ).catch(() => {
                props.history.push("/");
            });
        }
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

    if (values.status && values.status.toLowerCase() === "ready" && isStarted === true) {
        setIsStarted(false);
        isStarted = false;
    }

    if (isDeckUpdated === false) {
        //get the deck from server
        setIsDeckUpdated(true)

        const pResponse = axios({
            method: "POST",
            url: '/game/get',
            params: {gameId: gameId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                if (response.data.message == "OK") {
                    if (response.data.body.status.toLowerCase().indexOf("ready") !== -1) {
                        props.history.push("/waitingRoom?game=" + gameId + "&player=" + response.data.body + "&status=ready");
                    } else if (response.data.body.status.toLowerCase().indexOf("finished") !== -1) {
                        props.history.push("/message?msg=game_over");
                    } else if (response.data.body.status.toLowerCase().indexOf("inprogress") !== -1) {
                        let dummyCards = [];
                        for (let i = 0; i < 52; i++) {
                            dummyCards.push({"i": i, cardName: "Cblue_back", selected: false});
                        }
                        let history = response.data.body.history;
                        for (let i = 0; i < history.length; i++) {
                            let card = history[i];
                            dummyCards[card.cardPosition].cardName = getCardName(card.card.value, card.card.type);
                            dummyCards[card.cardPosition].selected = true;
                        }
                        setCards(dummyCards);
                    }
                    return {status: true, data: response.data};
                }
            }
            return {status: false, data: response.data};
        }).catch(() => {
            props.history.push("/");

        });

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
            setCurrentPlayerId(player.id);
        } else if (body.command === "TakeTwo") {
            let player = data.player;
            updateMessage("top", player.name + " needs to pick 2 cards" +
                " now.");
            setCurrentPlayerId(player.id);
        } else if (body.command === "QueenOfHeartPicked") {
            let player = data.player;
            console.log(player);
            debugger;
            updateMessage("top", " Game ended " + player.name + " lost!!");
            //redirect to diffrent page
            // props.history.push("/message?msg=game_over");
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
        if (currentPlayerId !== null && currentPlayerId !== playerId)
            return new Promise((resolve, reject) => {
                resolve({status: false});
            });

        const pResponse = axios({
            method: "POST",
            url: '/card/draw',
            params: {playerId: playerId, gameId: gameId, cardPosition: cardId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                if (response.data.message === "Error") {
                    return {status: false, data: response.data};
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
    const hideDiv = {display: "none"};
    const showDiv = {display: "block"};

    return (
        //TODO:: pass deck here
        <div>
            <div className={"game-ready"} style={(isStarted ? hideDiv : showDiv)}>
                <h1>Game not started</h1>
            </div>
            <div className={"game-started"} style={(!isStarted ? hideDiv : showDiv)}>
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