package QueenOfHeart.controller;

import QueenOfHeart.model.Game;

import QueenOfHeart.model.GameStatus;
import QueenOfHeart.repository.IGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/game")
public class GameController {
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public @ResponseBody
    Response<Long> addNewGame(@RequestParam String name) {
        Game n = new Game();
        n.setName(name);
        gameRepository.save(n);
        return new Response<>("Game Added", n.getId());
    }

    @RequestMapping(path = "/start", method = RequestMethod.POST)
    public @ResponseBody
    Response<String> startGame(@RequestParam Long gameId) {
        Game game = gameRepository.findById(gameId).get();
        game.setStatus(GameStatus.InProgress);
        gameRepository.save(game);
        return new Response<>("Game started", "OK");
    }

    @RequestMapping(path = "/get", method = RequestMethod.POST)
    public @ResponseBody
    Response<Game> getGame(@RequestParam Long gameId) {
        Game game = gameRepository.findById(gameId).get();

        return new Response<>("OK", game);
    }
}