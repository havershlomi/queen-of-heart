package QueenOfHeart.logic.Actions;

import com.google.gson.Gson;

public class BaseAction {
    private static Gson gson = new Gson();

    public String toJson() {
        String jsonString = gson.toJson(this);
        return jsonString;
    }
}
