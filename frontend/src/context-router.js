import React from 'react';
import axios from 'axios';
import {isGameValid} from "./utils";

import {Redirect, Route} from "react-router-dom";
import queryString from 'query-string'


export default function ContextRouter({component: Component, ...rest}) {
    const [status, setStatus] = React.useState(false);

    const getGameId = () => {
        return new Promise((resolve, reject) => {
            const values = queryString.parse(window.location.search);
            let _gameId = values.game;
            resolve(_gameId);
        });
    }

    const getGame = (gameId) => {
        if (!isGameValid(gameId))
            return new Promise((resolve, reject) => {
                resolve({status: false, data: null});
            });

        let game = axios({
            method: "POST",
            url: '/game/get',
            params: {gameId: gameId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                if (response.data.message == "OK") {
                    return {status: true, data: response.data.body};
                }
            }
            return {status: false, data: null};
        }).catch(() => {
            return {status: false, data: null};
        });

        return game;
    };

    getGameId().then(getGame).then((response) => {
        setStatus(response.status);
    });

    return (
        <Route {...rest} render={(props) => (

            status === true
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                }}/>

        )}/>);

}