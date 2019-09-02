const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import FormDialog from "./material-dialog";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'
import {isGameValid, getGame} from './utils';

export default function Player(props) {
    const [gameId, setGameId] = React.useState(null);
    const [gameName, setGameName] = React.useState(null);

    if (gameId === null) {
        const values = queryString.parse(window.location.search);
        let _gameId = values.game;
        if (!isGameValid(_gameId)) {
            props.history.push("/?msg=invalid_game");
        }
        else {
            setGameId(_gameId);
        }
    }

    if (gameId !== null && gameName === null) {
        getGame(gameId).then(response => {
            if (response.status === 200) {
                if (response.data.message === "OK") {
                    let body = response.data.body;
                    setGameName(body.name);
                } else if (response.data.message === "InvalidGame") {
                    props.history.push("/?msg=invalid_game");
                }
            }
        });
    }


    function onPlayerCreate(newPlayer) {
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
                // setPlayerId(response.data);
                if (response.data.message === "OK") {
                    return {
                        status: true,
                        data: response.data.body,
                        callback: () => (props.history.push("/waitingRoom?game=" + gameId + "&player=" + response.data.body + "&status=ready"))
                    };
                } else if (response.data.message.indexOf("InvalidGame") !== -1) {
                    return {
                        status: true,
                        data: response.data.body,
                        callback: () => (props.history.push("/"))
                    };
                } else {
                    throw response.data.message;
                }
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    return (
        //TODO: add validation to forms
        <div>
            <h2>Game: {gameName}</h2>
            <FormDialog buttonName="Join the game" header="Create player" confirmButton="Join"
                        attributes={["Name"]}
                        confirmedAction={onPlayerCreate}/>
        </div>
    )
};
