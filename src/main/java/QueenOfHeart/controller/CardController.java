package QueenOfHeart.controller;

import QueenOfHeart.model.*;
import QueenOfHeart.repository.ICardRepository;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import net.bytebuddy.TypeCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

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
    GameAction drawCard(@RequestParam long playerId, @RequestParam long gameId) {

        Game game = gameRepository.findById(gameId).get();
        Player player = playerRepository.findById(playerId).get();
        List<GamePlayHistory> gameHistory = game.getHistory();
        List<Integer> usedCards = new ArrayList<>();

        for (GamePlayHistory play : gameHistory) {
            usedCards.add(play.getCard());
        }
        Deck deck = new Deck(usedCards);
        int selectedCard = deck.drawCard();

        GameAction action = new GameAction(GameAction.Actions.CardDraw, "" + selectedCard);
        game.addAction(action);

        GamePlayHistory gp = new GamePlayHistory(selectedCard, player, game);
        game.addPlay(gp);

        //TODO: add some rules here
        EntityTransaction transaction = em_.getTransaction();
        transaction.begin();

        em_.persist(action);
        em_.flush();
        transaction.commit();
        return action;
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    List<GamePlayHistory> getCardsForGame(@RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        return game.getHistory();
    }

}