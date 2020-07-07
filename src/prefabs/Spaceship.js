class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);

        //store pointValue
        this.points = pointValue;

        this.scroll = Math.random();
        this.move = 1;
        if(this.scroll <0.5){
            this.move = -1;
            this.flipX = true;
        }
    }

    update() {
        // move spaceship left
        this.x -= game.settings.spaceshipSpeed * this.move;

        //wraparound from left to right edge
        if(this.x <= 0 - this.width && this.move == 1)
        {
            this.x = game.config.width;
        }
        else if(this.x >= this.width + game.config.width && this.move == -1)
        {
            this.x = 0 - this.width;
        }
    }

    reset(){
        this.x = game.config.width;
    }
}