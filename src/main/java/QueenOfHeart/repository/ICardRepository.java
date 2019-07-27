package QueenOfHeart.repository;

import QueenOfHeart.model.GamePlayHistory;
import QueenOfHeart.model.Player;
import org.springframework.data.repository.CrudRepository;

public interface ICardRepository extends CrudRepository<GamePlayHistory, Long> {
}
