const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import Board from "./board";
import FormDialog from "./material-dialog";


export default function App() {
    const [gameId, setGameId] = React.useState(null);
    const [playerId, setPlayerId] = React.useState(null);

    function onGameCreate(newGame) {
        const pResponse = axios({
            method: "POST",
            url: '/game/add',
            params: newGame,
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                setGameId(response.data);
                return {status: true, data: response.data};
                //show link here and hide this

            }
            return {status: false, data: response.data};
        });

        return pResponse;

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
                setPlayerId(response.data);
                return {status: true, data: response.data};
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    function drawCard(cardId) {
        const pResponse = axios({
            method: "POST",
            url: '/card/draw',
            params: {playerId: playerId, gameId: gameId, cardId: cardId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                return {status: true, data: response.data};
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    return (
        <div>
            <div>
                <h2>Lets start a new game</h2>
                <FormDialog buttonName="Create game" header="Create game" confirmButton="Add" attributes={["Name"]}
                            confirmedAction={onGameCreate}/>
                <FormDialog buttonName="Join the game" header="Create player" confirmButton="Join"
                            attributes={["Name"]}
                            confirmedAction={onPlayerCreate}/>
            </div>
            <div>
                <Board drawCard={drawCard}/>
            </div>
        </div>
    )
};
