package QueenOfHeart.logic.Actions;

import QueenOfHeart.logic.Card;

public class CardDraw extends BaseAction {
    public Card selectedCard;
    public long player;
    public int cardId;

    public CardDraw(int selectedCard, long player, int cardId) {
        this.player = player;
        this.selectedCard = Card.getCard(selectedCard);
        this.cardId = cardId;
    }
}
