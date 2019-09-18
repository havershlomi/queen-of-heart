package QueenOfHeart.logic.Actions;

import QueenOfHeart.model.Player;

import java.util.Map;

public class GameEnd extends BaseAction {
    public Map<String, Object> player;

    public GameEnd(Player player) {
        this.player = player.getPlayer();
    }
}
