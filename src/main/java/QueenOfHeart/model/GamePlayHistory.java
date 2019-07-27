package QueenOfHeart.model;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.ManyToMany;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;


public class GamePlayHistory {

    private Game game;

    @ManyToMany
    private Player player;

    private Date time;

    @Max(52)
    @Min(0)
    private int card;
}
