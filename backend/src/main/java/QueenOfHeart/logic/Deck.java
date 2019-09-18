package QueenOfHeart.logic;

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
        this.availableCards.removeAll(usedCards);
    }

    public int drawCard() {
        if (this.availableCards.size() == 0)
            return -1;

        Random rand = new Random();
        int index = rand.nextInt(this.availableCards.size());
        int selectedCard = this.availableCards.get(index);
        this.availableCards.remove(new Integer(selectedCard));
        return selectedCard;
    }
}
