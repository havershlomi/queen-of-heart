package QueenOfHeart.logic;

import QueenOfHeart.logic.Actions.BaseAction;
import QueenOfHeart.logic.Actions.CardDraw;
import QueenOfHeart.model.Game;
import QueenOfHeart.model.GameAction;
import QueenOfHeart.model.Player;
import java.util.ArrayList;
import java.util.List;

public class ActionManager {

    public static List<GameAction> getNextActions(Game game, Player currentPlayer, int selectedCard) {
        List<GameAction> actions = new ArrayList<>();
        BaseAction draw = new CardDraw(selectedCard, currentPlayer.getId());
        GameAction cardDraw = new GameAction(GameAction.Actions.CardDraw, draw.toJson());
        actions.add(cardDraw);



        return actions;
    }

}