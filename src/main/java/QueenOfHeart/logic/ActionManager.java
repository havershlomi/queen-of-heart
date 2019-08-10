package QueenOfHeart.logic;

import QueenOfHeart.logic.Actions.*;
import QueenOfHeart.model.Game;
import QueenOfHeart.model.GameAction;
import QueenOfHeart.model.GameStatus;
import QueenOfHeart.model.Player;
import jdk.nashorn.internal.ir.annotations.Reference;

import java.util.ArrayList;
import java.util.List;

import static QueenOfHeart.model.GameAction.Actions.Punish;

public class ActionManager {

    public static List<GameAction> getNextActions(@Reference Game game, Player currentPlayer, int selectedCard, int cardId) {
        List<GameAction> actions = new ArrayList<>();
        BaseAction draw = new CardDraw(selectedCard, currentPlayer, cardId);
        GameAction cardDraw = new GameAction(GameAction.Actions.CardDraw, draw.toJson());
        actions.add(cardDraw);

        GameAction.Actions nextAction = Rules.getAction(selectedCard);
        Player nextPlayer;
        BaseAction action;
        GameAction gameAction = null;
        switch (nextAction) {
            case TakeOne:
                gameAction = generateTakeOneAction(game, currentPlayer);
                break;
            case SkipNext:
                nextPlayer = getNextPlayer(game, currentPlayer);
                actions.add(new GameAction(GameAction.Actions.SkipNext, new Skip(nextPlayer.getId()).toJson()));
                gameAction = generateTakeOneAction(game, nextPlayer);
                break;
            case ChangeDirection:
                game.changeDireaction();
                actions.add(new GameAction(GameAction.Actions.ChangeDirection, new BaseAction().toJson()));
                gameAction = generateTakeOneAction(game, currentPlayer);
                break;
            case Take3Together:
                gameAction = generateTake3TogheterAction(game, currentPlayer);
                break;
            case TakeTwo:
                action = new TakeTwo(currentPlayer);
                gameAction = new GameAction(GameAction.Actions.TakeTwo, action.toJson());
                break;
            case QueenOfHeartPicked:
                game.setLosingPlayer(currentPlayer.getId());
                game.setStatus(GameStatus.Finished);
                action = new GameEnd(currentPlayer.getId());
                gameAction = new GameAction(GameAction.Actions.QueenOfHeartPicked, action.toJson());
                break;
            case Punish:
                action = new Punish(currentPlayer.getId());
                gameAction = new GameAction(Punish, action.toJson());
                break;
        }

        actions.add(gameAction);

        return actions;
    }

    private static GameAction generateTakeOneAction(@Reference Game game, Player currentPlayer) {
        Player nextPlayer;
        BaseAction action;
        nextPlayer = getNextPlayer(game, currentPlayer);
        action = new TakeOne(nextPlayer);
        return new GameAction(GameAction.Actions.TakeOne, action.toJson());
    }

    private static Player getNextPlayer(Game game, Player currentPlayer) {
        List<Player> playerList = game.getPlayers();

        if (game.getDireaction() == 1) {
            for (int i = 0; i < playerList.size(); i++) {
                if (playerList.get(i).equals(currentPlayer)) {
                    if (i < playerList.size() - 1) {
                        return playerList.get(i + 1);
                    } else {
                        return playerList.get(0);
                    }
                }
            }
        } else {
            //counter clockwise
            for (int i = playerList.size() - 1; i >= 0; i--) {
                if (playerList.get(i).equals(currentPlayer)) {
                    if (i > 0) {
                        return playerList.get(i - 1);
                    } else {
                        return playerList.get(playerList.size() - 1);
                    }
                }
            }
        }
        return null;
    }

    private static GameAction generateTake3TogheterAction(@Reference Game game, Player currentPlayer) {
        List<Long> playerIds = new ArrayList<>();
        if (game.getPlayers().size() <= 5) {

            for (Player player : game.getPlayers()) {
                playerIds.add(player.getId());
            }
        } else {
            //TODO: refactor that better
            playerIds.add(currentPlayer.getId());
            Player nextPlayer;
            //1 a head
            nextPlayer = getNextPlayer(game, currentPlayer);
            playerIds.add(nextPlayer.getId());
            //2 a head
            nextPlayer = getNextPlayer(game, nextPlayer);
            playerIds.add(nextPlayer.getId());
            game.changeDireaction();
            //1 before
            nextPlayer = getNextPlayer(game, currentPlayer);
            playerIds.add(nextPlayer.getId());
            //2 before
            nextPlayer = getNextPlayer(game, nextPlayer);
            playerIds.add(nextPlayer.getId());
            game.changeDireaction();
        }
        BaseAction baseAction = new Take3Together(playerIds);
        return new GameAction(GameAction.Actions.Take3Together, baseAction.toJson());


    }

}