import plugins from './plugins';
import Game from './Game';
import Player from './Player'

var loader = PIXI.loader;


let game = new Game();

loader
    .add([
        "assets/cat.png",
        "assets/board.png",
        "assets/P1.json",
        "assets/P2.json",
        "assets/win.png",
        "assets/loose.png",
        "assets/draw.png"

    ])
    .on("progress", game.loadProgressHandler)
    .load((loader, resources) => {game.setup()});

//game.start();
