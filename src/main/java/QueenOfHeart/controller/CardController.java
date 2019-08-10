package QueenOfHeart.controller;

import QueenOfHeart.WebSocketConfiguration;
import QueenOfHeart.logic.ActionManager;
import QueenOfHeart.logic.Actions.ErrorAction;
import QueenOfHeart.logic.Actions.GameEnd;
import QueenOfHeart.logic.Deck;
import QueenOfHeart.model.*;
import QueenOfHeart.repository.IActionRepository;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@EnableScheduling
@RequestMapping(path = "/card")
public class CardController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;
    @Autowired
    private IActionRepository actionRepository;

    @Autowired
    private SimpMessagingTemplate websocket;
    @Autowired
    private EntityLinks entityLinks;


    @RequestMapping(path = "/draw", method = RequestMethod.POST)
    public @ResponseBody
    List<GameAction> drawCard(@RequestParam long playerId, @RequestParam long gameId, @RequestParam int cardPosition) {

        Game game = gameRepository.findById(gameId).get();
        if (!game.isPlayerBelongs(playerId)) {
            GameAction action = new GameAction(GameAction.Actions.Error, new ErrorAction("Game doesn't exist").toJson());
            List<GameAction> actions = new ArrayList<>();
            actions.add(action);
            return actions;
        }

        if (game.getStatus() == GameStatus.Finished) {
            GameAction action = new GameAction(GameAction.Actions.GameEnded, new GameEnd(game.getLosingPlayer()).toJson());
            List<GameAction> actions = new ArrayList<>();
            actions.add(action);
            return actions;
        }

        Player player = playerRepository.findById(playerId).get();

        if (!canDrawCard(game, player)) {
            GameAction action = new GameAction(GameAction.Actions.Error, new ErrorAction("It isn't your turn!").toJson());
            List<GameAction> actions = new ArrayList<>();
            actions.add(action);
            return actions;
        }

        List<GamePlayHistory> gameHistory = game.getHistory();
        List<Integer> usedCards = new ArrayList<>();

        Deck deck = getDeck(gameHistory, usedCards);

        int selectedCard = deck.drawCard();

        List<GameAction> actions = ActionManager.getNextActions(game, player, selectedCard, cardPosition);
        for (GameAction action : actions) {
            game.addAction(action);
        }

        GamePlayHistory gp = new GamePlayHistory(selectedCard, player, game, cardPosition);
        game.addPlay(gp);

        for (GameAction action : actions) {
            actionRepository.save(action);
            updateCards(action);
        }
        gameRepository.save(game);

        return actions;
    }

    private boolean canDrawCard(Game game, Player player) {
        List<GameAction> history = game.getActions();
        if (history.size() == 0) {
            if (game.getGameCreator().equals(player))
                return true;
        } else {
            GameAction action = history.get(history.size() - 1);
            String command = action.getCommand();
            if (command.equals(GameAction.Actions.TakeOne.name()) ||
                    command.equals(GameAction.Actions.TakeTwo.name()) ||
                    command.equals(GameAction.Actions.Take3Together.name())) {
                if (action.getData().contains(String.valueOf(player.getId()))) {
                    return true;
                }
            }
        }
        return false;
    }

    private Deck getDeck(List<GamePlayHistory> gameHistory, List<Integer> usedCards) {
        for (GamePlayHistory play : gameHistory) {
            usedCards.add(play.getCardId());
        }

        return new Deck(usedCards);
    }

    private void updateCards(GameAction gameAction) {
        websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX + "/draw", gameAction);
    }

    /**
     * Take an {@link GameAction} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param employee
     */
    private String getPath(GameAction employee) {
        return this.entityLinks.linkForSingleResource(employee.getClass(),
                employee.getId()).toUri().getPath();
    }

    @GetMapping(path = "/history")
    public @ResponseBody
    List<GamePlayHistory> getCardsForGame(@RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        return game.getHistory();
    }

    @GetMapping(path = "/actions")
    public @ResponseBody
    List<GameAction> getActions(@RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        return game.getActions();
    }


}
