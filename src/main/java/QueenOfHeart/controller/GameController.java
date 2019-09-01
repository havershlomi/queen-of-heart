package QueenOfHeart.controller;

import QueenOfHeart.WebSocketConfiguration;
import QueenOfHeart.model.Game;

import QueenOfHeart.model.GameStatus;
import QueenOfHeart.repository.IGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/game")
public class GameController {

    @Autowired
    private IGameRepository gameRepository;
    @Autowired
    private SimpMessagingTemplate websocket;

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
            if (game.getPlayers().size() < 2) {
                return Response.Error("Please wait for other players to join");
            }
            game.setStatus(GameStatus.InProgress);
            gameRepository.save(game);
            gameStatusChange(game);
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
            return Response.Ok(game);
        }
        return Response.Error(null);

    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public @ResponseBody
    Response<List<Map<String, Object>>> getPlayers(@RequestParam Long gameId) {
        Optional<Game> oGame = gameRepository.findById(gameId);

        if (oGame.isPresent()) {
            Game game = oGame.get();

            List<Map<String, Object>> players = game.getPlayersObj();
            return new Response<>("OK", players);
        }
        return new Response<>("Error", null);
    }


    private void gameStatusChange(Game game) {
        Map<String, Object> msg = game.getGame();
        websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX + "/" + String.valueOf(game.getId()) + "/status", msg);
    }
}