import Snackbar from "@material-ui/core/Snackbar/Snackbar";

const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import MySnackbarContentWrapper from "./snack-bar";
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import UserIcon from '@material-ui/icons/SupervisedUserCircle';

const stompClient = require('./websocket-listener');

export default function WaitingRoom(props) {
    const [players, setPlayers] = React.useState([]);
    let [playerId, setPlayerId] = React.useState(null);
    let [gameId, setGameId] = React.useState(null);
    const [ownerId, setOwnerId] = React.useState(null);

    const [message, setMessage] = React.useState("");
    const [openErrorMessage, setOpenErrorMessage] = React.useState(false);


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
            props.history.push("/game?game=" + gameId + "&player=" + playerId);
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
                    if (response.data.message == "OK") {
                        props.history.push("/game?game=" + gameId + "&player=" + playerId);
                    } else if (response.data.message == "Error") {
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

    return (

        <div>
            <div className={"room-container"}>
                <h2>Who is going to play</h2>
                <div>
                    <h3>Invite people to join</h3>
                    <input className="share-link" type="text" readOnly value={location.origin + "/player?game=" + gameId}/>
                </div>
            </div>
            <Grid container spacing={2} wrap="nowrap">
                <Grid item xs={3} md={4} lg={5}></Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <List dense={false}>
                        {players.map(player => {
                            return (<ListItem key={player}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <UserIcon/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={player}
                                />
                            </ListItem>)
                        })}
                    </List>
                </Grid>
            </Grid>
            {ownerId === playerId ?
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