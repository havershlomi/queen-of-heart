const React = require('react');
import {createBrowserHistory} from "history";


export default function Message(props) {

    return (
        <h1 style={{display: (props.message !== null ? "block" : "none")}}>{props.message} lost</h1>
    )
};
