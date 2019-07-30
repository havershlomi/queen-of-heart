package QueenOfHeart.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Deck {

    private static List<Integer> _deck;
    private List<Integer> availableCards;

    static {
        _deck = new ArrayList<>();
        for (int i = 0; i < 52; i++) {
            _deck.add(i);
        }
    }

    public Deck(List<Integer> usedCards) {
        this.availableCards = new ArrayList<>(_deck);
        // TODO: Check if it works on refrences
        this.availableCards.removeAll(usedCards);
    }

    public static String cardToString(int card) {
        int type = card / 13;
        int value = card % 13;
        String cardType = CardType.getType(type).toString();
        return cardType + "-" + value;
    }

    public int drawCard() {
        if (this.availableCards.size() == 0)
            return -1;
        //TODO get the card from here

        Random rand = new Random();
        int index = rand.nextInt(this.availableCards.size());
        int selectedCard = this.availableCards.get(index);
        this.availableCards.remove(new Integer(selectedCard));
        return selectedCard;
    }
}
