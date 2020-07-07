class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);

        this.sfxRocket = scene.sound.add('sfx_rocket');

        this.isFiring = false;

        this.isMovingL = false;
        this.isMovingR = false;
    }
    update(){
        if(keyLEFT.isDown && this.x >= 47)
        {
            this.x-=2;
            this.isMovingL = true;
            this.isMovingR = false;
            this.flipX = true;

        }
        else if(keyRIGHT.isDown && this.x <= 578)
        {
            this.x += 2;
            this.isMovingR = true;
            this.isMovingL = false;
            this.flipX = false;

        }
        else{
            this.isMovingL = false;
            this.isMovingR = false;
        }
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }
        //if fired, move up
        if(this.isFiring && this.y >= 108)
        {
            this.y -= 2;
        }
        //reset on miss
        if(this.y <= 108)
        {
            this.isFiring = false;
            this.y = 431;
        }
    }
    reset() {
        this.isFiring = false;
        this.y = 431;
        
    }
    moving() {

    }
}