/**
 * Created by Erika on 5/1/2017.
 */

import PIXI from 'pixi.js';

export default class Player extends PIXI.extras.MovieClip {

    constructor(textures){
        super(textures);
    }
    
    updatePhysics() {
        //Moves game pieces
        if (this.vy === undefined)
            this.vy = 0;
        this.vy = this.vy + 1;
        if (this.vy > 20)
            this.vy = 20;
        this.y += this.vy;
    }

}

