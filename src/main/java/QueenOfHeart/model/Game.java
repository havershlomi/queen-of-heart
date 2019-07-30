package QueenOfHeart.model;

import sun.net.www.content.text.PlainTextInputStream;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity(name = "Game")
@Table(name = "Games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String name;

    @GeneratedValue(strategy = GenerationType.AUTO)
    private Date creationTime;
    private Date endTime;
    private GameStatus status;
    private long losingPlayer;

    public Game() {
        this.setStatus(GameStatus.Ready);
        this.setLosingPlayer(-1);
        this.creationTime = Utils.getCurrentUtcTime();
    }

    @OneToMany(mappedBy = "game")
    private List<Player> players = new ArrayList<>();

    @OneToMany(mappedBy = "game",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<GamePlayHistory> history = new ArrayList<>();

    public List<GamePlayHistory> getHistory() {
        return this.history;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreationTime() {
        return creationTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    public long getLosingPlayer() {
        return losingPlayer;
    }

    public void setLosingPlayer(long losingPlayer) {
        this.losingPlayer = losingPlayer;
    }

    public List<Player> getPlayers() {
        return this.players;
    }


    public long getId() {
        return this.id;
    }

    public void addPlayer(Player player) {
        this.players.add(player);
    }

    public void addPlay(GamePlayHistory gamePlayHistory) {
        history.add(gamePlayHistory);
        gamePlayHistory.setGame(this);
    }

    public void removePlay(GamePlayHistory gamePlayHistory) {
        history.remove(gamePlayHistory);
        gamePlayHistory.setGame(null);
    }
}

