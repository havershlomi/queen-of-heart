const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import FormDialog from "./material-dialog";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'


export default function Player(props) {
    const [gameId, setGameId] = React.useState(null);

    if (gameId === null) {
        const values = queryString.parse(window.location.search);
        let _gameId = parseInt(values.game, 10);
        if (!isGameValid(_gameId)) {
            props.history.push("/?msg=invalid_game");
        }
        else {
            setGameId(_gameId);
        }
    }

    function isGameValid(gameId) {
        if (isNaN(gameId) || gameId <= 0)
            return false;
        return true;
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
                return {
                    status: true,
                    data: response.data,
                    callback: () => (props.history.push("/game?game=" + gameId + "&player=" + response.data))
                };
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    return (
        //TODO: add validation to forms
        <div>

            <FormDialog buttonName="Join the game" header="Create player" confirmButton="Join"
                        attributes={["Name"]}
                        confirmedAction={onPlayerCreate}/>
        </div>
    )
};
