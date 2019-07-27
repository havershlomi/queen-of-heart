package QueenOfHeart.model;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;

@Entity
public class GamePlayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToOne
    private Game game;

    @OneToOne
    private Player player;

    private Date time;

    @Max(52)
    @Min(0)
    private int card;

    public GamePlayHistory() {
    }

    public GamePlayHistory(int card, Player player, Game game) {
        this.card = card;
        this.game = game;
        this.player = player;
        this.time = Utils.getCurrentUtcTime();
    }

    public int getCard() {
        return this.card;
    }

    public Date getTime() {
        return this.time;
    }

    public long getPlayerId(){
        return this.player.getId();
    }

    public long getGameId(){
        return this.game.getId();
    }


}
