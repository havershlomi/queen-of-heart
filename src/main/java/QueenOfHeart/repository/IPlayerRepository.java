package QueenOfHeart.repository;

import QueenOfHeart.model.Game;
import QueenOfHeart.model.Player;
import org.springframework.data.repository.CrudRepository;

public interface IPlayerRepository extends CrudRepository<Player, Long> {
}
