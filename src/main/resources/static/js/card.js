import React, {useState, useEffect} from 'react';


export default function Card(props) {
    const [cardSelected, setCardSelected] = useState(false);

    const drawCard = () => {
        if (!cardSelected) {
            props.drawFunc(props.cardId);
            setCardSelected(true);
        }
    };

    return (
        <div className={"card " + props.cardName}
             onClick={drawCard}>
        </div>
    );
}