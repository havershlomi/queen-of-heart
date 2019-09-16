import React from 'react';
import axios from 'axios';
import Game from "./game";
import WaitingRoom from "./waiting-room";
import FormDialog from "./material-dialog";
import ButtonAppBar from "./button-app-bar"
import {BrowserRouter as Router, Route} from "react-router-dom";
import {getGame, getPlayer} from "./utils";
import {createBrowserHistory} from "history";
import Message from "./message";
import queryString from "query-string";


const customHistory = createBrowserHistory();


export default function App() {
    const [gameId, setGameId] = React.useState(null);
    const [playerId, setPlayerId] = React.useState(null);
    const [gameName, setGameName] = React.useState(null);
    const [playerName, setPlayerName] = React.useState(null);
    const gameRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const losingPlayerRef = React.useRef(null);

    const values = queryString.parse(window.location.search);

    if (window.location.port.length === 0) {
        axios.defaults.baseURL = window.location.origin;
    } else {
        axios.defaults.baseURL = window.location.origin.substr(0, window.location.origin.lastIndexOf(":" + window.location.port)) + ":8080";
    }

    if (losingPlayerRef.current === null && values.msg === "game_over" && values.playerName !== undefined) {
        losingPlayerRef.current = values.playerName;
    }

    React.useEffect(() => {
        if (gameRef.current !== gameId) {
            setGameName(null);
        }
        gameRef.current = gameId;

    }, [gameId]);

    React.useEffect(() => {
        playerRef.current = playerId;
        if ((playerName === null) && values.msg === undefined) {
            if (playerId !== null || values.player !== undefined) {
                getPlayer(playerId || values.player).then(response => {
                    if (response.status === 200) {
                        if (response.data.message === "OK") {
                            setPlayerName(response.data.body.name);
                        } else if (response.data.message === "InvalidPlayer") {
                            customHistory.push("/player?game=" + gameId + "&msg=invalid_player");
                        }
                    }
                });
            }
        }
        if (playerId === null && values.player !== undefined) {
            setPlayerId(values.player);
        }
    }, [playerId]);

    function onGameCreate(newGame, history) {
        const pResponse = axios({
            method: "POST",
            url: '/game/add',
            params: newGame,
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                setGameId(response.data.body);
                return {
                    status: true,
                    data: response.data.body,
                    callback: () => (history.push("/player?game=" + response.data.body))
                };
                //show link here and hide this
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    function onPlayerCreate(newPlayer, history) {
        if (gameId == null)
            return new Promise((resolve, reject) => {
                reject("Please create a game before adding a player");
            });

        const pResponse = axios({
            method: "POST",
            url: '/player/add',
            params: {name: newPlayer.name, gameId: gameId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                setPlayerId(response.data.body);
                if (response.data.message === "OK") {
                    return {
                        status: true,
                        data: response.data.body,
                        callback: () => (history.push("/waitingRoom?game=" + gameId + "&player=" + response.data.body + "&status=ready"))
                    };
                } else if (response.data.message.indexOf("InvalidGame") !== -1) {
                    return {
                        status: true,
                        data: response.data.body,
                        callback: () => (history.push("/"))
                    };
                } else {
                    throw response.data.message;
                }
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }


    if (gameName === null) {
        if (values.game !== undefined || gameId !== null) {
            getGame(values.game || gameId).then(response => {
                if (response.status === 200) {
                    if (response.data.message === "OK") {
                        setGameName(response.data.body.name);
                        setGameId(values.game);
                    } else if (response.data.message === "InvalidGame") {
                        customHistory.push("/?msg=invalid_game");
                    }
                }
            });

        }

    }


    return (

        <div className="app-container">
            <ButtonAppBar title={"❤️ Queen of hearts ❤️"} gameName={gameName} playerName={playerName}/>
            <Router>
                <div style={{textAlign: "center", marginTop: "10px"}}>
                    <Route path="/" exact render={({history}) => (
                        <div>
                            <Message message={losingPlayerRef.current}/>
                            <FormDialog buttonName="Create game" header="Create game" confirmButton="Add"
                                        attributes={["Name"]}
                                        confirmedAction={(obj) => onGameCreate(obj, history)}/>
                        </div>
                    )}/>
                    <Route path="/player" render={({history}) => (
                        <FormDialog buttonName="Join the game" header="Create player" confirmButton="Join"
                                    attributes={["Name"]}
                                    confirmedAction={(obj) => onPlayerCreate(obj, history)}/>
                    )}/>
                    <Route path="/waitingRoom"
                           render={({history}) => (
                               <WaitingRoom history={history} playerId={playerRef} gameId={gameRef}/>)}/>
                    <Route path="/game" render={({history}) => (
                        <Game history={history} playerId={playerRef} losingPlayer={losingPlayerRef}/>)}/>
                </div>
            </Router>
        </div>
    )
};
