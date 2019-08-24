package QueenOfHeart.controller;

import QueenOfHeart.model.Game;

import QueenOfHeart.model.GameStatus;
import QueenOfHeart.repository.IGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Optional<Game> oGame = gameRepository.findById(gameId);
        if (oGame.isPresent()) {
            Game game = oGame.get();

            game.setStatus(GameStatus.InProgress);
            gameRepository.save(game);
            return Response.Ok("Game started");
        }
        return Response.Error(null);
    }

    @RequestMapping(path = "/get", method = RequestMethod.POST)
    public @ResponseBody
    Response<Game> getGame(@RequestParam Long gameId) {
        Optional<Game> oGame = gameRepository.findById(gameId);
        if (oGame.isPresent()) {
            Game game = oGame.get();
            return new Response<>("OK", game);
        }
        return new Response<>("Error", null);

    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public @ResponseBody
    Response<List<String>> getPlayers(@RequestParam Long gameId) {
        Optional<Game> oGame = gameRepository.findById(gameId);

        if (oGame.isPresent()) {
            Game game = oGame.get();

            List<String> players = game.getPlayerNames();
            return new Response<>("OK", players);
        }
        return new Response<>("Error", null);
    }
}