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


export default function Game(props) {
    let [gameId, setGameId] = React.useState(null);
    let [playerId, setPlayerId] = React.useState(null);
    const cookies = new Cookies();

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

    return (
        //TODO:: pass deck here
        <div>
            <Board drawCard={drawCard} deck={null} me={playerId}/>
        </div>
    )
};
