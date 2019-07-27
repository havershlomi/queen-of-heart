package QueenOfHeart.repository;

import QueenOfHeart.model.Game;
import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends CrudRepository<Game, Integer> {

}
//
//public class GameRepository {
//    private EntityManager entityManager;
//
//    public GameRepository(EntityManager entityManager)
//    {
//        this.entityManager = entityManager;
//    }
//
//    public Optional<Game> createGame(Game game) {
//        try {
//            entityManager.getTransaction().begin();
//            entityManager.persist(game);
//            entityManager.getTransaction().commit();
//            return Optional.of(game);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return Optional.empty();
//    }
//
//}