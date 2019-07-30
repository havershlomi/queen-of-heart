package QueenOfHeart.controller;

import QueenOfHeart.model.Game;

import QueenOfHeart.repository.IGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/game")
public class GameController {
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/add", method = RequestMethod.POST) // Map ONLY GET Requests
    public @ResponseBody
    Long addNewGame(@RequestParam String name) {
        Game n = new Game();
        n.setName(name);
        gameRepository.save(n);
        return n.getId();
    }

    @GetMapping(path = "/all")
    public @ResponseBody
    Iterable<Game> getAllGames() {
        // This returns a JSON or XML with the users
        return gameRepository.findAll();
    }
}