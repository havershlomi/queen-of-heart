import Snackbar from "@material-ui/core/Snackbar/Snackbar";

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import MySnackbarContentWrapper from "./snack-bar";

const stompClient = require('./websocket-listener');

export default function WaitingRoom(props) {
    const [players, setPlayers] = React.useState([]);
    const [fetches, setFetches] = React.useState(false);
    const [gameId, setGameId] = React.useState(null);

    if (gameId === null) {
        const values = queryString.parse(window.location.search);
        let _gameId = parseInt(values.game, 10);
        if (!isGameValid(_gameId)) {
            props.history.push("/?msg=invalid_game");
        }
        else {
            setGameId(_gameId);
            const pResponse = axios({
                method: "POST",
                url: '/game/players',
                params: {gameId: _gameId},
                headers: {'Content-Type': 'application/json; charset=utf-8"'}
            }).then(response => {
                    if (response.status === 200) {
                        if (response.data.message == "OK") {
                            setPlayers(response.data.body);
                            stompClient.register([
                                {route: '/topic/' + _gameId + '/player', callback: addPlayer},
                            ]);
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

    function isGameValid(gameId) {
        if (isNaN(gameId) || gameId <= 0)
            return false;
        return true;
    }

    function addPlayer(response) {
        var data = JSON.parse(response.body)
        setPlayers(data);
    }

    return (

        <div>
            <div className={"room-container"}>
                <h1>Who is going to play</h1>
                <div>
                    <h4>Invite people to join</h4>
                    <span>{location.origin}/player?game={gameId}</span>
                </div>
            </div>
            <ul>
                {players.map(player => {
                    return (<li key={player}>{player}</li>)
                })}
            </ul>

        </div>
    )
};