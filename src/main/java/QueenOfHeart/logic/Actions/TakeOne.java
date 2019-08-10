package QueenOfHeart.logic.Actions;

import QueenOfHeart.model.Player;

import java.util.Map;

public class TakeOne extends BaseAction {
    public Map<String, Object> player;

    public TakeOne(Player player)
    {
        this.player = player.getPlayer();
    }
}
