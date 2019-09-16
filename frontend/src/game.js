import React from 'react';
import axios from 'axios';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Board from "./board";
import queryString from 'query-string'
import MySnackbarContentWrapper from "./snack-bar";
import {isGameValid, getGame} from './utils';

const stompClient = require('./websocket-listener');
const timePerTurnMs = 7000;
export default function Game(props) {
    let [gameId, setGameId] = React.useState(null);
    const [currentPlayerId, setCurrentPlayerId] = React.useState(null);
    const [isConnected, setIsConnected] = React.useState(false);
    const [isDeckUpdated, setIsDeckUpdated] = React.useState(false);
    let [isStarted, setIsStarted] = React.useState(true);
    const [currentPlayer, setCurrentPlayer] = React.useState(null);
    const [lastCard, setLastCard] = React.useState("Cblue_back");
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [autoPickCard, setAutoPickCard] = React.useState(null);

    const [cards, setCards] = React.useState([]);
    const cardsRef = React.useRef(cards);

    //Messgaes
    const [isOpenBottom, setIsOpenBottom] = React.useState(false);
    const [isOpenTop, setIsOpenTop] = React.useState(false);
    const [infoMessage, setInfoMessage] = React.useState("");
    const [topInfoMessage, setTopInfoMessage] = React.useState("");

    //For updating of the ref
    React.useEffect(() => {
        cardsRef.current = cards;
    }, [cards]);

    const values = queryString.parse(window.location.search);

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
            getGame(gameId).then(response => {
                    if (response.status === 200) {
                        if (response.data.message === "OK") {
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


    if (values.status && values.status.toLowerCase() === "ready" && isStarted === true) {
        setIsStarted(false);
        isStarted = false;
    }

    if (isDeckUpdated === false) {
        setIsDeckUpdated(true)
        getGame(gameId).then(response => {
            if (response.status === 200) {
                let game = response.data.body;

                if (response.data.message === "OK") {
                    if (response.data.body.status.toLowerCase().indexOf("ready") !== -1) {
                        props.history.push("/waitingRoom?game=" + gameId + "&player=" + response.data.body + "&status=ready");
                    } else if (response.data.body.status.toLowerCase().indexOf("finished") !== -1) {
                        let lastAction = game.actions[game.actions.length - 1];
                        if (lastAction.command === "QueenOfHeartPicked") {
                            let player = JSON.parse(lastAction.data).player;
                            props.losingPlayer.current = player.name;
                            props.history.push("/?msg=game_over&playerName=" + player.name);
                        } else {
                            props.history.push("/");
                        }
                        return;
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
                        if (history.length > 0) {
                            setLastCard(getCardName(history[history.length - 1].card.value, history[history.length - 1].card.type));
                        }

                        let player = getCurrentPlayer(response.data.body);
                        setCurrentPlayer(player);
                        handleNextTurn(player.id);

                    }
                    return {status: true, data: response.data};
                }
            }
            return {status: false, data: response.data};
        }).catch((error) => {
            props.history.push("/");

        });

    }

    function getCurrentPlayer(game) {
        if (game.history.length === 0) {
            return {
                "id": game.creatorId,
                "name": game.creatorName
            };
        } else {
            for (let i = game.actions.length - 1; i > 0; i--) {
                let action = game.actions[i];
                let data = JSON.parse(action.data);
                if (action.command === "TakeOne" || action.command === "TakeTwo") {
                    let player = data.player;
                    return player;
                }
            }
        }
    }

    function cardUpdate(response) {
        var body = JSON.parse(response.body);
        var data = JSON.parse(body.data);

        if (body.command === "CardDraw") {
            let cardId = data.cardId;
            let selectedCard = data.selectedCard;
            let cardName = getCardName(selectedCard.value, selectedCard.type);
            // let newCards = cardsRef.current.slice();
            let newCards = Object.assign([...cardsRef.current]);
            // newCards[cardId] = Object.assign({}, newCards[cardId]);
            newCards[cardId].cardName = cardName;
            newCards[cardId].selected = true;
            setCards(newCards);
            setLastCard(cardName);

            let player = data.player;
            updateMessage("bottom", player.name + " drawd the: " + selectedCard.valueName + " of " + selectedCard.type);
        } else if (body.command === "TakeOne") {
            let player = data.player;
            // updateMessage("top", "It's " + player.name + "'s turn now.");
            setCurrentPlayer(player);
            handleNextTurn(player.id);
        } else if (body.command === "TakeTwo") {
            let player = data.player;
            setCurrentPlayer(player);
            handleNextTurn(player.id);
            updateMessage("top", player.name + " needs to pick 2 cards now.");
            setCurrentPlayerId(player.id);
        } else if (body.command === "QueenOfHeartPicked") {
            let player = data.player;
            updateMessage("top", " Game ended " + player.name + " lost!!");
            setTimeout(() => {
                props.losingPlayer.current = player.name;
                props.history.push("/?msg=game_over&playerName=" + player.name);
            }, 5000);
            //Disable drawing for everybody
            setIsDrawing(true);
        }
    }

    const handleNextTurn = (nextPlayerId) => {
        setCurrentPlayerId(nextPlayerId);
        if (props.playerId.current === nextPlayerId) {
            let token = setTimeout(() => {
                setIsDrawing(true);
                let _cards = cardsRef.current;
                for (let i = 0; i < _cards.length; i++) {
                    if (!_cards[i].selected) {
                        drawCard(i);
                        break;
                    }
                }
            }, timePerTurnMs);
            setAutoPickCard(token);
        }
    };

    const updateMessage = (type, message) => {
        if (type === "bottom") {
            setInfoMessage(message);
            setIsOpenBottom(true);
        } else {
            setTopInfoMessage(message);
            setIsOpenTop(true);
        }
    };


    function drawCard(cardId) {
        if ((currentPlayerId !== null && currentPlayerId !== props.playerId.current) || isDrawing)
            return new Promise((resolve, reject) => {
                resolve({status: false});
            });

        if (autoPickCard !== null) {
            clearTimeout(autoPickCard);
            setAutoPickCard(null);
        }
        setIsDrawing(true);
        const pResponse = axios({
            method: "POST",
            url: '/card/draw',
            params: {playerId: props.playerId.current, gameId: gameId, cardPosition: cardId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            setIsDrawing(false);
            if (response.status === 200) {
                if (response.data.message === "Error") {
                    return {status: false, data: response.data};
                }
                return {status: true, data: response.data};
            }
            return {status: false, data: response.data};
        }).catch(() => {
            setIsDrawing(false);
            return {status: false};
        });

        return pResponse;
    }

    const handleCloseInfoMessage = (type, event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (type === "bottom") {
            setIsOpenBottom(false);
        } else {
            setIsOpenTop(false);
        }
    };
    const hideDiv = {display: "none"};
    const showDiv = {display: "block"};

    return (
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
                <Board drawCard={drawCard} deck={cards} me={props.playerId} lastCard={lastCard}
                       timePerTurn={timePerTurnMs}
                       currentPlayer={currentPlayer}/>
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