const axios = require('axios')

export function isGameValid(gameId) {
    if (gameId === undefined || gameId === null)
        return false;
    return true;
}


export function isPlayerValid(playerId) {
    if (playerId === undefined || playerId === null)
        return false;
    return true;
}

export function getGame(gameId) {
    return axios({
        method: "POST",
        url: '/game/get',
        params: {gameId: gameId},
        headers: {'Content-Type': 'application/json; charset=utf-8"'}
    });
};


export function getPlayers(gameId) {
    return axios({
        method: "POST",
        url: '/game/players',
        params: {gameId: gameId},
        headers: {'Content-Type': 'application/json; charset=utf-8"'}
    });
};
