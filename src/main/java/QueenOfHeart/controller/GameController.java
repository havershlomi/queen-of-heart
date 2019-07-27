package QueenOfHeart.controller;

import QueenOfHeart.model.Game;
import QueenOfHeart.model.GameStatus;

import QueenOfHeart.model.Player;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import hello.Greeting;
import QueenOfHeart.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sun.net.www.content.text.PlainTextInputStream;

import java.time.LocalDateTime;

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