package QueenOfHeart.logic;

import QueenOfHeart.model.Game;
import QueenOfHeart.model.GameAction;
import sun.util.resources.ar.CurrencyNames_ar_DZ;

import java.util.Random;


public class Rules {
    public static final int KING = 0;
    public static final int QUEEN = 12;
    public static final int PRINCE = 11;
    public static final int ACE = 1;

    public static GameAction.Actions getAction(int card) {
        Card cr = Card.getCard(card);
        GameAction.Actions selectedAction;
        if (cr.value == 2) {
            selectedAction = GameAction.Actions.TakeTwo;
        }
//        else if (cr.value == Rules.KING || cr.value == Rules.PRINCE) {
//            selectedAction = GameAction.Actions.Punish;
//        }
        else if (cr.value == 3) {
            selectedAction = GameAction.Actions.Take3Together;
        } else if (cr.value == 7) {
            selectedAction = GameAction.Actions.ChangeDirection;
        } else if (cr.value == 8) {
            selectedAction = GameAction.Actions.SkipNext;
        } else if (cr.value == QUEEN) {
            if (cr.type == CardType.Hearts)
                selectedAction = GameAction.Actions.QueenOfHeartPicked;
            else
                selectedAction = GameAction.Actions.TakeOne;
        } else {
            selectedAction = GameAction.Actions.TakeOne;
        }

        return selectedAction;
    }
}
