package QueenOfHeart.controller;

import QueenOfHeart.logic.ActionManager;
import QueenOfHeart.logic.Actions.GameEnd;
import QueenOfHeart.logic.Deck;
import QueenOfHeart.model.*;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "/card")
public class CardController {

    private EntityManagerFactory emf_ = Persistence.createEntityManagerFactory("QueenOfHeartDB");
    private EntityManager em_ = emf_.createEntityManager();

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/draw", method = RequestMethod.POST)
    public @ResponseBody
    List<GameAction> drawCard(@RequestParam long playerId, @RequestParam long gameId) {

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

        List<GameAction> actions = ActionManager.getNextActions(game, player, selectedCard);
        for (GameAction action : actions) {
            game.addAction(action);
        }

        GamePlayHistory gp = new GamePlayHistory(selectedCard, player, game);
        game.addPlay(gp);

        //TODO: add some rules here
        EntityTransaction transaction = em_.getTransaction();
        transaction.begin();
        //TODO: Check if it works also
        for (GameAction action : actions) {
            em_.persist(action);
        }
        em_.flush();
        transaction.commit();
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