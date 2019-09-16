import React, {useState} from 'react';


export default function Card(props) {
    const [cardSelected, setCardSelected] = useState(false);

    if (!cardSelected && props.selected) {
        setCardSelected(true);
    }

    const drawCard = () => {
        if (!cardSelected) {
            props.drawFunc(props.cardId).then((response) => {
                if (response.status === true) {
                    setCardSelected(true);
                }
            });
        }
    };

    return (
        <div className={"card " + props.cardName}
             onClick={drawCard}>
        </div>
    );
}