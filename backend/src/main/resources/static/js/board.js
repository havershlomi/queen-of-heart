import React from 'react';
import Card from './card';

export default function Board(props) {
    let currentPlayer = !props.currentPlayer ? {"name": ""} : props.currentPlayer;
    const [isMyTurn, setIsMyTurn] = React.useState(false);
    const [timeRemains, setTimeRemains] = React.useState(0);
    const [counterToken, setCounterToken] = React.useState(null);
    const [startTime, setStartTime] = React.useState(null);

    // React.useEffect(() => {
    //     if (startTime !== null) {
    //         let token = setInterval(() => {
    //             let timeElapsed = Date.now() - startTime;
    //             if (timeElapsed >= props.timePerTurn) {
    //                 clearInterval(counterToken);
    //                 setCounterToken(null);
    //             }
    //             setTimeRemains(Math.ceil((props.timePerTurn - timeElapsed) / 1000));
    //         }, 1000);
    //         setCounterToken(token);
    //     } else {
    //         if (counterToken !== null) {
    //             clearInterval(counterToken);
    //             setCounterToken(null);
    //         }
    //     }
    // }, [startTime]);
    //
    let _isMyTurn = props.me.current === currentPlayer["id"];
    if (isMyTurn !== _isMyTurn) {
        setIsMyTurn(_isMyTurn);
        // if (_isMyTurn) {
        //     setStartTime(Date.now());
        // } else {
        //     setStartTime(null);
        // }
    }


    return (
        <div className="board-container">
            <div className="header">
                <label
                    className={"turn-label"}>{isMyTurn ? "Your turn" : "Turn: " + currentPlayer["name"]}</label>
                {/*<label className={"time-left"} style={{display: (isMyTurn ? "inline-block" : "none")}}>*/}
                    {/*{timeRemains}*/}
                {/*</label>*/}
                <Card key={props.lastCard} cardId={props.lastCard} cardName={props.lastCard}
                      selected={true}/>
            </div>
            <div className="board">
                {props.deck.map(card => {
                    return (<Card key={card.i} cardId={card.i} cardName={card.cardName} drawFunc={props.drawCard}
                                  selected={card.selected}/>)
                })}

            </div>
        </div>
    );
}
