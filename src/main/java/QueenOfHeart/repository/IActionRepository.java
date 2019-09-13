package QueenOfHeart.repository;

import QueenOfHeart.model.GameAction;
import org.springframework.data.repository.CrudRepository;

public interface IActionRepository extends CrudRepository<GameAction, Long> {
}
