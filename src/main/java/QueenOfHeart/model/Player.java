package QueenOfHeart.model;

import sun.net.www.content.text.PlainTextInputStream;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "Players")
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GAME_ID")
    private Game game;

    @NotNull
    private String name;
    @NotNull
    private int position;

    public Player() {
    }

    public Player(String name, Game game) {
        this.name = name;
        this.game = game;
        this.position = game.getPlayers().size() + 1;
    }

    //    story> gamePlayes = new HashSet<>();
    public String getName() {
        return name;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getPosition() {
        return position;
    }

    public long getId() {
        return id;
    }
}
