package QueenOfHeart.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

@Entity(name = "Game")
@Table(name = "Games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String uuid;

    @GeneratedValue(strategy = GenerationType.AUTO)
    private Date creationTime;
    private Date endTime;
    private GameStatus status;
    private long losingPlayer;
    //Direaction 1 means clockwise, -1 counter clockwise
    private int direaction = 1;

    @OneToOne
    private Player gameCreator;

    public Game() {
        this.uuid = String.valueOf(UUID.randomUUID());
        this.setStatus(GameStatus.Ready);
        this.setLosingPlayer(-1);
        this.creationTime = Utils.getCurrentUtcTime();
    }

    @OneToMany(mappedBy = "game")
    private List<Player> players = new ArrayList<>();

    @OneToMany(mappedBy = "game")
    private List<GameAction> actions = new ArrayList<>();

    @OneToMany(mappedBy = "game",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<GamePlayHistory> history = new ArrayList<>();

    public List<GamePlayHistory> getHistory() {
        return this.history;
    }

    public List<GameAction> getActions() {
        return this.actions;
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

    public boolean isPlayerBelongs(Long playerId) {
        for (Player p : this.players) {
            if (p.getId().equals(playerId))
                return true;
        }
        return false;
    }

    public int getDireaction() {
        return this.direaction;
    }

    public void changeDireaction() {
        this.direaction = direaction * -1;
    }

    public Long getId() {
        return this.id;
    }

    public String getUuid() {
        return uuid;
    }

    public void addPlayer(Player player) {
        if (this.players.size() == 0) {
            this.gameCreator = player;
        }
        this.players.add(player);
    }

    public Player getGameCreator() {
        return this.gameCreator;
    }

    public Map<String, Object> getGameCreatorObj() {
        return this.gameCreator.getPlayer();
    }

    public void addAction(GameAction action) {
        actions.add(action);
        action.setGame(this);
    }

    public void addPlay(GamePlayHistory gamePlayHistory) {
        history.add(gamePlayHistory);
        gamePlayHistory.setGame(this);
    }

    public void removePlay(GamePlayHistory gamePlayHistory) {
        history.remove(gamePlayHistory);
        gamePlayHistory.setGame(null);
    }

    public List<Map<String, Object>> getPlayersObj() {
        List<Map<String, Object>> players =
                this.getPlayers().stream().sorted(Comparator.comparing(Player::getPosition)).map(player -> player.getPlayer()).collect(Collectors.toList());

        return players;
    }

    public Map<String, Object> getGame() {
        Map<String, Object> dictionary = new HashMap<String, Object>();
        dictionary.put("name", this.name);
        dictionary.put("id", this.id);
        dictionary.put("creatorId", this.gameCreator == null ? null : this.gameCreator.getUuid());
        dictionary.put("creatorName", this.gameCreator == null ? null : this.gameCreator.getName());
        dictionary.put("status", this.status.toString());
        dictionary.put("history", this.getHistory());
        dictionary.put("actions", this.getActions());
        return dictionary;
    }
}

