import PIXI from 'pixi.js';
import Player from './Player.js';
import Board from './Board';

//aliases
var Container = PIXI.Container,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//matrix used to find board pieces (players/AI checked slots)
var boardMap = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]];

export default class Game {
    constructor() {
        const Renderer = PIXI.CanvasRenderer;
        this.renderer = new Renderer(644, 480, {backgroundColor : 0x2DA68E});
        document.getElementById("game").appendChild(this.renderer.view);

        this.animationLoop = new PIXI.AnimationLoop(this.renderer);
        this.animationLoop.on('prerender', this.update.bind(this));
        this.animationLoop.on('postrender', function(){
            PIXI.timerManager.update(this.delta); //Pass as param the delta time to PIXI.timerManager.update
        });
        var stage = this.animationLoop.stage;
        stage.visible = true;

        //game scenes
        this.gameScene = new Container();
        stage.addChild(this.gameScene);
        this.gameScene.visible = true;

        this.board = null;
        this.group = [];

    }

    loadProgressHandler(loader, resource) {
        //Display the file `url` currently being loaded
        console.log("loading: " + resource.url);

        //Display the precentage of files currently loaded
        console.log("progress: " + loader.progress + "%");
    }

    setup() {
        //Win/Loose/Draw splashscreens 
        let textureWinScreen = PIXI.Texture.fromImage('assets/win.png',false, 1);
        this.spriteWinScreen = new Sprite(textureWinScreen);
        this.spriteWinScreen.position.set(0, 0);
        this.spriteWinScreen.visible=false;
        let textureLooseScreen = PIXI.Texture.fromImage('assets/loose.png',false, 1);
        this.spriteLooseScreen = new Sprite(textureLooseScreen);
        this.spriteLooseScreen.position.set(0, 0);
        this.spriteLooseScreen.visible=false;
        let textureDrawScreen = PIXI.Texture.fromImage('assets/draw.png',false, 1);
        this.spriteDrawScreen = new Sprite(textureDrawScreen);
        this.spriteDrawScreen.position.set(0, 0);
        this.spriteDrawScreen.visible=false;

        this.Player1Textures = [];
        for (let i = 0; i < 12; i++) {
            let texture = PIXI.Texture.fromFrame('P1_' + (i+1) + '.png');
            this.Player1Textures.push(texture);
        }

        this.Player2Textures = [];
        for (let i = 0; i < 12; i++) {
            let texture = PIXI.Texture.fromFrame('P2_' + (i+1) + '.png');
            this.Player2Textures.push(texture);
        }

        this.turnState = 0; //0->player 1 turn, 1->verify player 1, 2->player 2 turn, 3->verify player 2


        this.board = new Sprite(resources["assets/board.png"].texture);
        this.board.position.set(0, 0);
        this.board.click =  (e) => {
            if(this.turnState!=0) {
                return;
            }
            let mousePosition = e.data.global;
            let selected = Math.floor((mousePosition.x / 644) * 7);
            if(this.newBall(selected, 1))
                this.nextTurnState();

        };
        this.board.interactive = true;
        this.gameScene.addChild(this.board);
        

        var timer = PIXI.timerManager.createTimer(500);
        timer.loop = true;
        timer.on('repeat', (elapsedTime, repeat)=>{this.processTurn();});
        timer.start();
        this.start();
    }

    //will switch players turns 
    processTurn() {
        switch(this.turnState) {
            case 0: {
                console.log("0");
                break;
            }
            case 1: {
                console.log("1");
                let result = Board.checkWinner(boardMap);
                if (result==0)
                    this.nextTurnState();
                if(result==1 && this.spriteWinScreen.visible==false) {
                    this.spriteWinScreen.visible = true;
                    this.gameScene.addChild(this.spriteWinScreen);

                    this.spriteWinScreen.interactive= true;
                    this.spriteWinScreen.click = (e)=>{
                        console.log("Recebeu Evento - Ganhou");
                        this.spriteWinScreen.interactive= false;
                        this.resetGame();
                    }

                }
                if(result==3 && this.spriteDrawScreen.visible==false) {
                    console.log("Draw");
                    this.spriteDrawScreen.interactive= true;
                    this.spriteDrawScreen.click = (e)=>{
                        this.spriteDrawScreen.interactive= false;
                        this.resetGame();
                    }
                    this.spriteDrawScreen.visible = true;
                    this.gameScene.addChild(this.spriteDrawScreen);
                }
                console.log(result);
                break;
            }
            case 2: {
                console.log("2");
                let randomPosition= Math.floor(Math.random() * 7);
                if(this.newBall(randomPosition, 2))
                    this.nextTurnState();
                break;
            }
            case 3: {
                console.log("3");
                let result = Board.checkWinner(boardMap);
                if (result==0)
                    this.nextTurnState();
                if(result==2 && this.spriteLooseScreen.visible==false) {
                    console.log("P2 Won");
                    this.spriteLooseScreen.interactive= true;
                    this.spriteLooseScreen.click = (e)=>{
                        this.spriteLooseScreen.interactive= false;
                        this.resetGame();
                    }
                    this.spriteLooseScreen.visible = true;
                    this.gameScene.addChild(this.spriteLooseScreen);

                }
                if(result==3 && this.spriteDrawScreen.visible==false) {
                    console.log("Draw");
                    this.spriteDrawScreen.interactive= true;
                    this.spriteDrawScreen.click = (e)=>{
                        this.spriteDrawScreen.interactive= false;
                        this.resetGame();
                    }
                    this.spriteDrawScreen.visible = true;
                    this.gameScene.addChild(this.spriteDrawScreen);
                }
                break;
            }
            default: {
                console.log("Invalid choice");
                break;
            }
        }
    }
    //to give next turn
    nextTurnState() {
        this.turnState++;
        if (this.turnState>3) this.turnState=0;
    }

    //throws a player move in a position at the board
    newBall(ballPosition, playerId){
        if (boardMap[0][ballPosition] == 0) {
            let piece;
            if(playerId==1)
                piece = new Player(this.Player1Textures);
            else
                piece = new Player(this.Player2Textures);
            piece.animationSpeed = 0.1;
            piece.play();
            this.group.push(piece);
            this.gameScene.addChild(piece);
            piece.x = ballPosition * (644 / 7);

            if (boardMap[5][ballPosition] == 0) {
                boardMap[5][ballPosition] = playerId;
                return true;
            }
            for (let i = 0; i < 5; i++) {
                if (boardMap[i][ballPosition] == 0 && boardMap[i + 1][ballPosition] != 0) {
                    boardMap[i][ballPosition] = playerId;
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    update() {
        this.group.forEach((piece) => {
            piece.updatePhysics();

            //Boundaries of the game *board limits*
            this.contain(piece, {x: 0, y: 0, width: 644, height: 480});
            //contain(sprite, stage);
            this.group.forEach((pieceStatic) => {
                if (piece == pieceStatic)
                    return;
                this.avoidSobreposition(piece, pieceStatic);
            });
        });
    }

    start(){
        this.animationLoop.start();
    }

    //resets everything for a new game match
    resetGame(){
        console.log("ResetGame");
        boardMap = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]];

        this.spriteWinScreen.visible=false;
        this.spriteLooseScreen.visible=false;
        this.spriteDrawScreen.visible=false;
        for (let i = 0; i <= this.group.length; i++) {
            this.gameScene.removeChild(this.group[i]);
        }
        this.group = [];
        this.turnState = 0;
    }

    //allows new game "pieces" above other game "pieces" at the board
    contain(sprite, container) {

        var collision = undefined;

        //Top
        if (sprite.y < container.y) {
            sprite.y = container.y;
            collision = "top";
        }

        //Bottom
        if (sprite.y + sprite.height > container.height) {
            sprite.y = container.height - sprite.height;
            collision = "bottom";
        }

        //Return the `collision` value
        return collision;
    }
    
    //avoids 2 pieces per slot
    avoidSobreposition(movingSprite, staticSprite) {

        //Bottom
        if (movingSprite.y + movingSprite.height > staticSprite.y && movingSprite.y < staticSprite.y && movingSprite.x == staticSprite.x) {
            movingSprite.y = staticSprite.y - movingSprite.height;
        }
    }

}
