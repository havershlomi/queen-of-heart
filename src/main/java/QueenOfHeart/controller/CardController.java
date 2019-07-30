package QueenOfHeart.controller;

import QueenOfHeart.model.Deck;
import QueenOfHeart.model.Game;
import QueenOfHeart.model.GamePlayHistory;
import QueenOfHeart.model.Player;
import QueenOfHeart.repository.ICardRepository;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import net.bytebuddy.TypeCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping(path = "/card")
public class CardController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/draw", method = RequestMethod.POST)
    public @ResponseBody
    int drawCard(@RequestParam long playerId, @RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        Player player = playerRepository.findById(playerId).get();
        List<GamePlayHistory> gameHistory = game.getHistory();
        List<Integer> usedCards = new ArrayList<>();

        for (GamePlayHistory play : gameHistory) {
            usedCards.add(play.getCard());
        }
        Deck deck = new Deck(usedCards);

        int selectedCard = deck.drawCard();

        GamePlayHistory gp = new GamePlayHistory(selectedCard, player, game);
        game.addPlay(gp);

        gameRepository.save(game);
        //TODO: add some rules here
        return selectedCard;
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    List<GamePlayHistory> getCardsForGame(@RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        return game.getHistory();
    }

}