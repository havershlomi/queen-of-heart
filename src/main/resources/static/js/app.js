const React = require('react');
const ReactDOM = require('react-dom');
// const client = require('./client');
import Card from "./card";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {employees: []};
    }

    componentDidMount() {
        // client({method: 'GET', path: '/api/employees'}).done(response => {
        //     this.setState({employees: response.entity._embedded.employees});
        // });
    }

    render() {
        return (
            <div>
                <div>hello hello</div>
                <Card/>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)