package QueenOfHeart.repository;

import QueenOfHeart.model.GamePlayHistory;
import QueenOfHeart.model.Player;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ICardRepository extends CrudRepository<GamePlayHistory, Long> {
    @Query("Select gp from GamePlayHistory gp Where gp.game.id = ?1")
    List<GamePlayHistory> getMovesForGame(long gameId);
}
