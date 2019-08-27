import Snackbar from "@material-ui/core/Snackbar/Snackbar";

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import MySnackbarContentWrapper from "./snack-bar";
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const stompClient = require('./websocket-listener');

export default function WaitingRoom(props) {
    const [players, setPlayers] = React.useState([]);
    let [playerId, setPlayerId] = React.useState(null);
    let [gameId, setGameId] = React.useState(null);
    const [ownerId, setOwnerId] = React.useState(null);

    const values = queryString.parse(window.location.search);

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

    if (gameId === null) {
        gameId = parseInt(values.game, 10);
        if (!isIntValid(gameId)) {
            props.history.push("/?msg=invalid_game");
        }
        else {
            setGameId(gameId);
            axios({
                method: "POST",
                url: '/game/players',
                params: {gameId: gameId},
                headers: {'Content-Type': 'application/json; charset=utf-8"'}
            }).then(response => {
                    if (response.status === 200) {
                        if (response.data.message == "OK") {
                            setPlayers(response.data.body);
                            stompClient.register([
                                {route: '/topic/' + gameId + '/player', callback: addPlayer},
                                {route: '/topic/' + gameId + '/status', callback: statusChange},

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

            axios({
                method: "POST",
                url: '/game/get',
                params: {gameId: gameId},
                headers: {'Content-Type': 'application/json; charset=utf-8"'}
            }).then(response => {
                    if (response.status === 200) {
                        if (response.data.message == "OK") {
                            //TODO:: Check for status change
                            setOwnerId(response.data.body.gameCreator.id);
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

    function isIntValid(id) {
        if (isNaN(id) || id <= 0)
            return false;
        return true;
    }

    function addPlayer(response) {
        var data = JSON.parse(response.body)
        setPlayers(data);
    }

    function statusChange(response) {
        let body = JSON.parse(response.body);
        if (body.ceatorId === playerId)
            return;
        if (body.status.toLowerCase().indexOf("inprogress") !== -1) {
            debugger;
            props.history.push("/game?game=" + gameId + "&player=" + playerId );
        }
    }

    function startGame() {
        axios({
            method: "POST",
            url: '/game/start',
            params: {gameId: gameId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
                if (response.status === 200) {
                    if (response.data.message == "OK") {
                        debugger;
                        props.history.push("/game?game=" + gameId + "&player=" + playerId);
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

    return (

        <div>
            <div className={"room-container"}>
                <h1>Who is going to play</h1>
                <div>
                    <h4>Invite people to join</h4>
                    <span>{location.origin}/player?game={gameId}</span>
                </div>
                {ownerId === playerId ?
                    <Button variant="contained" color="primary" onClick={startGame}>
                        Start game
                    </Button> : ""
                }

            </div>
            <ul>
                {players.map(player => {
                    return (<li key={player}>{player}</li>)
                })}
            </ul>

        </div>
    )
};