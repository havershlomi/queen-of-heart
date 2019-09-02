package QueenOfHeart.model;

import sun.net.www.content.text.PlainTextInputStream;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Entity(name = "Players")
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "my_entity_seq_gen")
    private Long id;

    @NotNull
    private String uuid;

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
        this.uuid = String.valueOf(UUID.randomUUID());
        this.name = name;
        this.game = game;
        this.position = game.getPlayers().size() + 1;
    }

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

    public Long getId() {
        return id;
    }

    public String getUuid(){
        return this.uuid;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Player) {
            return this.id.equals(((Player) obj).id);
        }
        return false;
    }

    public Map<String, Object> getPlayer() {
        Map<String, Object> dictionary = new HashMap<String, Object>();
        dictionary.put("name", this.name);
        dictionary.put("id", this.uuid);
        return dictionary;
    }
}
