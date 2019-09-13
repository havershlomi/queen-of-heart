package QueenOfHeart.repository;

import QueenOfHeart.model.Game;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface IGameRepository extends CrudRepository<Game, Long> {
    @Query("FROM Game WHERE uuid = ?1")
    Optional<Game> findByUUID(String uuid);
}
