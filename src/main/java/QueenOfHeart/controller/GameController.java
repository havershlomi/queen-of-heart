package QueenOfHeart.controller;

import QueenOfHeart.model.Game;
import QueenOfHeart.repository.GameRepository;
import hello.Greeting;
import QueenOfHeart.model.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GameController {

    //    private EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("QueenOfHearts");
//    private EntityManager entityManager = entityManagerFactory.createEntityManager();
    @Autowired
    private GameRepository gameRepository;

    @RequestMapping(value = "/game", method = RequestMethod.POST)
    public Game createGame(@RequestBody Game game) {
        return gameRepository.save(game);
    }

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
        return new Greeting(1,
                String.format("dddd"));
    }

    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Car> update(@RequestBody Car car) {

        if (car != null) {
//            nullcar.setMiles(car.getMiles() + 100);
        }

        // TODO: call persistence layer to update
        return new ResponseEntity<Car>(car, HttpStatus.OK);
    }
}