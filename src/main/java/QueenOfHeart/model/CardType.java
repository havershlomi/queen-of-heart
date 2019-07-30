package QueenOfHeart.model;

public enum CardType {
    Clubs(4), Diamonds(3), Hearts(1), Spades(2);

    // declaring private variable for getting values
    private int type;

    // getter method
    public int getAction() {
        return this.type;
    }

    // enum constructor - cannot be public or protected
    private CardType(int type) {
        this.type = type;
    }

    public static CardType getType(int type) {
        switch (type) {
            case 1:
                return Hearts;
            case 2:
                return Spades;
            case 3:
                return Diamonds;
            case 4:
                return Clubs;
            default:
                return null;
        }
    }
}
