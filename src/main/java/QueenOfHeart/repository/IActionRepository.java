package QueenOfHeart.repository;

import QueenOfHeart.model.GameAction;
import QueenOfHeart.model.Player;
import org.springframework.data.repository.CrudRepository;

public interface IActionRepository extends CrudRepository<GameAction, Long> {
}
