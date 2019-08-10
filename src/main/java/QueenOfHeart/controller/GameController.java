package QueenOfHeart.controller;

import QueenOfHeart.model.Game;

import QueenOfHeart.model.GamePlayHistory;
import QueenOfHeart.repository.IGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/game")
public class GameController {
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public @ResponseBody
    Long addNewGame(@RequestParam String name) {
        Game n = new Game();
        n.setName(name);
        gameRepository.save(n);
        return n.getId();
    }

    @RequestMapping(path = "/cards", method = RequestMethod.POST)
    public @ResponseBody
    List<GamePlayHistory> getCards(@RequestParam Long gameId) {
        Game game = gameRepository.findById(gameId).get();

        return game.getHistory();
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    Iterable<Game> getAllGames() {
        // This returns a JSON or XML with the users
        return gameRepository.findAll();
    }
}