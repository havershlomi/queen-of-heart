package QueenOfHeart.logic.Actions;

import QueenOfHeart.logic.Card;
import QueenOfHeart.model.Player;

import java.util.Map;

public class CardDraw extends BaseAction {
    public Card selectedCard;
    public Map<String, Object> player;
    public int cardId;

    public CardDraw(int selectedCard, Player player, int cardId) {
        this.player = player.getPlayer();
        this.selectedCard = Card.getCard(selectedCard);
        this.cardId = cardId;
    }
}
