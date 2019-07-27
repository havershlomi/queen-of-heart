package QueenOfHeart.repository;

import QueenOfHeart.model.Game;
import org.springframework.data.repository.CrudRepository;

public interface IGameRepository extends CrudRepository<Game, Long>, IGameRepositoryExtend {
}
