const React = require('react');
const ReactDOM = require('react-dom');
// const client = require('./client');
import Card from "./card";

const axios = require('axios')

const client = require('./client');

import FormDialog from "./material-dialog";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {attributes: ["name"]};
        this.onGameCreate = function (newGame) {
            const pResponse = axios({
                method: "POST",
                url: '/game/add',
                params: newGame,
                headers: {'Content-Type': 'application/json; charset=utf-8"'}
            }).then(response => {
                if (response.status === 200) {
                    return {status: true, data: response.data};
                }
                return {status: false, data: response.data};
            });

            return pResponse;

        }.bind(this);

    }

    componentDidMount() {
        // client({method: 'GET', path: '/api/employees'}).done(response => {
        //     this.setState({employees: response.entity._embedded.employees});
        // });
    }


    render() {
        return (
            <div>
                <h2>Lets start a new game</h2>
                <FormDialog buttonName="Create game" header="Create game" confirmButton="Add" attributes={["Name"]}
                            confirmedAction={this.onGameCreate}/>
            </div>
        )
    }
}

ReactDOM
    .render(
        <App/>,
        document
            .getElementById(
                'react'
            )
    )


