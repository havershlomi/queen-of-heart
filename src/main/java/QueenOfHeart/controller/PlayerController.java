package QueenOfHeart.controller;

import QueenOfHeart.WebSocketConfiguration;
import QueenOfHeart.model.GameAction;
import QueenOfHeart.model.GameStatus;
import QueenOfHeart.model.Player;
import QueenOfHeart.model.Game;
import QueenOfHeart.repository.IGameRepository;
import QueenOfHeart.repository.IPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/player")
public class PlayerController {

    @Autowired
    private IPlayerRepository playerRepository;
    @Autowired
    private IGameRepository gameRepository;
    @Autowired
    private SimpMessagingTemplate websocket;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    public @ResponseBody
    Response<Long> addPlayerToGame(@RequestParam String name, @RequestParam long gameId, HttpServletResponse response) {
        Optional<Game> oGame = gameRepository.findById(gameId);
        if (oGame.isPresent()) {
            Game game = oGame.get();
            if (game.getStatus() == GameStatus.Ready) {

                Player p = new Player(name, game);
                game.addPlayer(p);
                playerRepository.save(p);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Set-Cookie", "key=" + "value");
                ResponseEntity.status(HttpStatus.OK).headers(headers).build();
                response.addCookie(new Cookie("q_player", String.valueOf(p.getId())));

                List<String> players = game.getPlayerNames();
                updatePlayers(gameId, players);
                return new Response<>("OK", p.getId());
            } else {
                return new Response<>("Can't add player in the middle of a game", -1L);
            }
        }
        return new Response<>("InvalidGame", -1L);
    }

    private void updatePlayers(Long gameId, List<String> players) {
        websocket.convertAndSend(WebSocketConfiguration.MESSAGE_PREFIX + "/" + String.valueOf(gameId) + "/player", players);
    }
}