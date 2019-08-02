package QueenOfHeart.logic.Actions;

import QueenOfHeart.logic.Card;

public class CardDraw extends BaseAction {
    public Card selectedCard;
    public long player;

    public CardDraw(int selectedCard, long player) {
        this.player = player;
        this.selectedCard = Card.getCard(selectedCard);
    }
}
