package QueenOfHeart.controller;

import QueenOfHeart.model.Player;
import QueenOfHeart.model.Game;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import hello.Greeting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/player")
public class PlayerController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public @ResponseBody
    Long addPlayerToGame(@RequestParam String name, @RequestParam long gameId) {
        Game game = gameRepository.findById(gameId).get();
        Player p = new Player(name, game);
        game.addPlayer(p);
        playerRepository.save(p);
        return p.getId();
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    Iterable<Player> getAllPlayers() {
        // This returns a JSON or XML with the users
        return playerRepository.findAll();
    }

}