package QueenOfHeart.model;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.Date;

@Entity(name="GamePlayHistory")
@Table(name = "game_play_history")
public class GamePlayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
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

    private Long getId()
    {
        return this.id;
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

    public void setGame(Game game)
    {
        this.game = game;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GamePlayHistory )) return false;
        return this.id != null && this.id.equals(((GamePlayHistory) o).getId());
    }
    @Override
    public int hashCode() {
        return 31;
    }


}
