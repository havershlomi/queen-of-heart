package QueenOfHeart.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import sun.net.www.content.text.PlainTextInputStream;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "Actions")
@Table(name = "actions")
public class GameAction {

    public enum Actions {
        GameStarted,
        CardDraw,
        TakeOne,
        TakeTwo,
        Punish,
        QueenOfHeartPicked,
        ChangeDirection,
        SkipNext,
        Take3Together,
        GameEnded
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id")
    private Game game;

    @NotNull
    private String command;

    @NotNull
    private String data;

    public GameAction() {
    }

    public GameAction(Actions action, String data) {
        this.command = action.name();
        this.data = data;
    }

    public String getCommand() {
        return command;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return this.id;
    }

    public String getData() {
        return this.data;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GameAction)) return false;
        return this.id != null && this.id.equals(((GameAction) o).getId());
    }

    @Override
    public int hashCode() {
        return 31;
    }
}

