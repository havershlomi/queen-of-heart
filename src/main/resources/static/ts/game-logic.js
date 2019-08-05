var Game = /** @class */ (function () {
    function Game(players) {
        this.players = {};
        for (var i = 0; i < players.length; i++) {
            this.players[players[i][0]] = players[i][1];
        }
    }
    Game.prototype.draw = function () {
    };
    return Game;
}());
