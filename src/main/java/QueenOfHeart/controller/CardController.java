package QueenOfHeart.controller;

import QueenOfHeart.logic.ActionManager;
import QueenOfHeart.logic.Actions.GameEnd;
import QueenOfHeart.logic.Deck;
import QueenOfHeart.model.*;
import QueenOfHeart.repository.IActionRepository;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/card")
public class CardController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;
    @Autowired
    private IActionRepository actionRepository;

    @RequestMapping(path = "/draw", method = RequestMethod.POST)
    public @ResponseBody
    List<GameAction> drawCard(@RequestParam long playerId, @RequestParam long gameId, @RequestParam int cardId) {

        //TODO: validate that player belong to this game
        Game game = gameRepository.findById(gameId).get();

        if (game.getStatus() == GameStatus.Finished) {
            GameAction action = new GameAction(GameAction.Actions.GameEnded, new GameEnd(game.getLosingPlayer()).toJson());
            List<GameAction> actions = new ArrayList<>();
            actions.add(action);
            return actions;
        }

        Player player = playerRepository.findById(playerId).get();
        List<GamePlayHistory> gameHistory = game.getHistory();
        List<Integer> usedCards = new ArrayList<>();

        Deck deck = getDeck(gameHistory, usedCards);

        int selectedCard = deck.drawCard();

        List<GameAction> actions = ActionManager.getNextActions(game, player, selectedCard, cardId);
        for (GameAction action : actions) {
            game.addAction(action);
        }

        GamePlayHistory gp = new GamePlayHistory(selectedCard, player, game);
        game.addPlay(gp);
//        EntityManagerFactory emf_ = Persistence.createEntityManagerFactory("QueenOfHeartDB");
//        EntityManager em_ = emf_.createEntityManager();

        for (GameAction action : actions) {
            actionRepository.save(action);
        }
        gameRepository.save(game);

        return actions;
    }

    private Deck getDeck(List<GamePlayHistory> gameHistory, List<Integer> usedCards) {
        for (GamePlayHistory play : gameHistory) {
            usedCards.add(play.getCard());
        }

        return new Deck(usedCards);
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
