package QueenOfHeart.model;

import sun.net.www.content.text.PlainTextInputStream;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Entity
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
        this.creationTime = getCurrentUtcTime();
    }

    @OneToMany(mappedBy = "game")
    private List<Player> players = new ArrayList<>();

//    @ManyToMany(mappedBy = "history", cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
//    private Set<GamePlayHistory> history = new HashSet<>();

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

    public void addPlayer(Player player){
        this.players.add(player);
    }

    private Date getCurrentUtcTime() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        try {
            return dateFormat.parse(dateFormat.format(date));
        } catch (ParseException e) {
            return null;
        }
    }

    public long getId() {
        return id;
    }
}

