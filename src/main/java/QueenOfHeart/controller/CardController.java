package QueenOfHeart.controller;

import QueenOfHeart.model.Game;
import QueenOfHeart.model.GamePlayHistory;
import QueenOfHeart.model.Player;
import QueenOfHeart.repository.ICardRepository;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping(path = "/card")
public class CardController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;
    @Autowired
    private ICardRepository cardRepository;

    @RequestMapping(path = "/draw", method = RequestMethod.POST)
    public @ResponseBody
    int drawCard(@RequestParam long playerId, @RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        Player player = playerRepository.findById(playerId).get();

        Random rand = new Random();
        int cardNum = rand.nextInt(52);
        GamePlayHistory gp = new GamePlayHistory(cardNum, player, game);
        cardRepository.save(gp);
        return cardNum;
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    Iterable<Player> getCardsForgame(@RequestParam long gameId) {

        return playerRepository.findAll();
    }

}