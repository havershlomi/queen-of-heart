const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios')
import Player from "./player";
import Game from "./game";
import WaitingRoom from "./waitingRoom";
import FormDialog from "./material-dialog";

import {BrowserRouter as Router, Route, Link} from "react-router-dom";


export default function App() {
    const [gameId, setGameId] = React.useState(null);

    function onGameCreate(newGame, history) {
        const pResponse = axios({
            method: "POST",
            url: '/game/add',
            params: newGame,
            headers: {'Content-Type': 'application/json; charset=utf-8"'}
        }).then(response => {
            if (response.status === 200) {
                setGameId(response.data);
                return {
                    status: true,
                    data: response.data.body,
                    callback: () => (history.push("/player?game=" + response.data.body))
                };
                //show link here and hide this
            }
            return {status: false, data: response.data};
        });

        return pResponse;
    }

    return (

        <div className="app-container">
            <Router>
                <div style={{textAlign: "center"}}>
                    <Route path="/" exact render={({history}) => (
                        < FormDialog buttonName="Create game" header="Create game" confirmButton="Add"
                                     attributes={["Name"]}
                                     confirmedAction={(obj) => onGameCreate(obj, history)}/>
                    )}/>
                    <Route path="/player" render={({history}) => (<Player history={history}/>)}/>
                    <Route path="/waitingRoom" render={({history}) => (<WaitingRoom history={history}/>)}/>
                    <Route path="/game" render={({history}) => (<Game history={history}/>)}/>
                    <Route path="/message" component={(props) => {
                        return (<h1>someone lost</h1>)
                    }}/>
                </div>
            </Router>
        </div>
    )
};
