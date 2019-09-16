import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import React from 'react';
import axios from 'axios';
import MySnackbarContentWrapper from "./snack-bar";
import Button from '@material-ui/core/Button';
import {getGame, getPlayers} from './utils';
import PlayersList from "./players-list";

const stompClient = require('./websocket-listener');

export default function WaitingRoom(props) {
    const [players, setPlayers] = React.useState([]);
    // let [playerId, setPlayerId] = React.useState(null);
    // let [gameId, setGameId] = React.useState(null);
    const [ownerId, setOwnerId] = React.useState(null);

    const [message, setMessage] = React.useState("");
    const [openErrorMessage, setOpenErrorMessage] = React.useState(false);
    const shareLink = React.useRef(null);

    React.useEffect(() => {
        shareLink.current.focus();
        shareLink.current.setSelectionRange(0, shareLink.current.value.length);
    }, [shareLink]);

    let gameId = props.gameId.current;

    if (props.gameId.current !== null && players.length === 0) {

        getPlayers(gameId).then(response => {
                if (response.status === 200) {
                    if (response.data.message === "OK") {
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
        ).catch((res) => {
            props.history.push("/");
        });

        getGame(gameId).then(response => {
                if (response.status === 200) {
                    if (response.data.message === "OK") {
                        //TODO:: Check for status change
                        let body = response.data.body;
                        setOwnerId(body.creatorId);
                        if (body.status.toLowerCase().indexOf("inprogress") !== -1) {
                            props.history.push("/game?game=" + props.gameId.current + "&player=" + props.playerId.current);
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

    function addPlayer(response) {
        var data = JSON.parse(response.body);
        setPlayers(data);
    }

    function statusChange(response) {
        let body = JSON.parse(response.body);
        if (body.creatorId === props.playerId.current)
            return;
        if (body.status.toLowerCase().indexOf("inprogress") !== -1) {
            props.history.push("/game?game=" + props.gameId.current + "&player=" + props.playerId.current);
        }
    }

    function handleCloseErrorMessage(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        setOpenErrorMessage(false);
    }

    function startGame() {
        axios({
            method: "POST",
            url: '/game/start',
            params: {gameId: gameId},
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
                if (response.status === 200) {
                    if (response.data.message === "OK") {
                        props.history.push("/game?game=" + props.gameId.current + "&player=" + props.playerId.current);
                    } else if (response.data.message === "Error") {
                        if (response.data.body != null) {
                            setMessage(response.data.body);
                            setOpenErrorMessage(true);
                        }
                    }
                    return {status: true, data: response.data};
                }
                return {status: false, data: response.data};
            }
        ).catch(() => {
            props.history.push("/");
        });
    }

    const selectMe = (elm) => {
        elm.focus();
    };

    return (

        <div>
            <div className={"room-container"}>
                <h2>Who is going to play</h2>
                <div>
                    <h3>Invite people to join</h3>
                    <input onLoad={selectMe} ref={shareLink} className="share-link" type="text" readOnly
                           value={window.location.origin + "/player?game=" + gameId}/>
                </div>
            </div>
            <PlayersList players={players} playerId={props.playerId}/>
            {ownerId === props.playerId.current ?
                <Button variant="contained" color="primary" onClick={startGame}>
                    Start game
                </Button> : ""
            }
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={openErrorMessage}
                autoHideDuration={3000}
                onClose={handleCloseErrorMessage}
            >
                <MySnackbarContentWrapper
                    onClose={handleCloseErrorMessage}
                    variant="error"
                    message={message}
                />
            </Snackbar>
        </div>
    )
};