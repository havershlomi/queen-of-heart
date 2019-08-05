class Game {

    players: { [id: number]: string; } = {};

    constructor(players: Array<[number, string]>) {
        for (var i = 0; i < players.length; i++) {
            this.players[players[i][0]] = players[i][1];
        }
    }

    draw(): void {

    }
}