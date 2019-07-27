package QueenOfHeart.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GAME_ID")
    private Game game;

    @NotNull
    private String name;
    private int order;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "GamePlayHistory",
            joinColumns = {@JoinColumn(name = "player_id")},
            inverseJoinColumns = {@JoinColumn(name = "game_id")}
    )
    private Set<GamePlayHistory> gamePlayes = new HashSet<>();

}
