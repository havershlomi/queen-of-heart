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
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GAME_ID")
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

    public long getId() {
        return id;
    }

    public String getData() {
        return this.data;
    }


}

