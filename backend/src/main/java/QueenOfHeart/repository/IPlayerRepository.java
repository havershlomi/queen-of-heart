package QueenOfHeart.repository;

import QueenOfHeart.model.Game;
import QueenOfHeart.model.Player;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface IPlayerRepository extends CrudRepository<Player, Long> {
    @Query("FROM Players WHERE uuid = ?1")
    Optional<Player> findByUUID(String uuid);
}
