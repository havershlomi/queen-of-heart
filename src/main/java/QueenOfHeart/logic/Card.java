package QueenOfHeart.logic;

public class Card {
    public int value;
    public CardType type;

    public Card(int value, CardType type) {
        this.type = type;
        this.value = value;
    }

    public CardType getType() {
        return type;
    }

    public static Card getCard(int card) {
        int type = card / 13;
        int value = card % 13;
        CardType cardType = CardType.getType(type);
        Card c = new Card(value, cardType);
        return c;
    }

}
