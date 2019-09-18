package QueenOfHeart.logic;

public class Card {
    public int value;
    public String valueName;
    public CardType type;

    public Card(int value, CardType type) {
        this.type = type;
        this.value = value;

        this.valueName = getValueName();
    }

    public CardType getType() {
        return type;
    }

    public static Card getCard(int card) {
        int type = (card / 13) + 1;
        int value = card % 13;
        CardType cardType = CardType.getType(type);
        Card c = new Card(value, cardType);
        return c;
    }

    private String getValueName() {
        switch (this.value) {
            case 0:
                return "King";
            case 12:
                return "Queen";
            case 11:
                return "Jack";
            case 1:
                return "Ace";
            default:
                return String.valueOf(this.value);
        }
    }
}
