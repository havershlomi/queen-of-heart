package QueenOfHeart.controller;

import QueenOfHeart.model.GameStatus;
import QueenOfHeart.model.Player;
import QueenOfHeart.model.Game;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
@RequestMapping(path = "/player")
public class PlayerController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public @ResponseBody
    Response<Long> addPlayerToGame(@RequestParam String name, @RequestParam long gameId, HttpServletResponse response) {
        Game game = gameRepository.findById(gameId).get();

        if (game.getStatus() == GameStatus.Ready) {

            Player p = new Player(name, game);
            game.addPlayer(p);
            playerRepository.save(p);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Set-Cookie", "key=" + "value");
            ResponseEntity.status(HttpStatus.OK).headers(headers).build();
            response.addCookie(new Cookie("q_player", String.valueOf(p.getId())));
            return new Response<>("OK", p.getId());
        } else {
            return new Response<>("Can't add player in the middle of a game", -1L);
        }
    }
}