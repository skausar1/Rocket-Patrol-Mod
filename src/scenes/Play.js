let scoreConfig;
let check = 0;
let bgSpeed = 2;
class Play extends Phaser.Scene {
    //Constructor
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/yarn.png');
        this.load.image('background', './assets/bg.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth:64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('catPlayer', './assets/kitty.png', {frameWidth:36, frameHeight: 46, startFrame: 0, endFrame: 1});
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('backgroundMusic', './assets/BackgroundMusic.mp3');
    }

    create(){
        var bg = this.sound.add('backgroundMusic');
        bg.play();
        //place tile spirte bg
        this.background = this.add.tileSprite(0,0, 640, 480, 'background').setOrigin(0,0);

        // while rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);

        //add rocket
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'catPlayer', 0, 'kitty').setOrigin(0,0);
        this.ship01 = new Spaceship(this, game.config.width + Math.random()*200, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + Math.random()*200, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width + Math.random()*200, 260, 'spaceship', 0, 10).setOrigin(0,0);
        
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({key: 'explode',
                           frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
                           frameRate: 30
                        });
        this.p1Score = 0;

        //score display
        scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        //creating the score display for current score
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        //creating the highscore during the play section
        this.highScoreText = this.add.text(480, 54, highScore, scoreConfig);
        //create time area
        this.timeText = this.add.text(350, 54, game.settings.gameTimer/1000, scoreConfig);
        //Fire area
        scoreConfig.align = 'center';

        //used for a gameover state
        this.gameOver =false;

        //sets the clock that will be used in the background
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu',
            scoreConfig).setOrigin(0.5);
            bg.pause();
            this.gameOver = true;
        }, null, this);
        this.clock = this.time.delayedCall(30000, () => {
            game.settings.spaceshipSpeed *=  1.45;
            bgSpeed = 4;
        }, null, this);
        this.timerCalc = game.settings.gameTimer/1000;
    }
    update(){

        //checks to see if the game is over, if so end game and stop input
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        //if the game is not over, update all assests
        if(!this.gameOver)
        {
            this.timerCalc -= 0.0165;
            this.timeText.text = (this.timerCalc | 0);
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            if(this.p1Score > highScore)
            {
                highScore = this.p1Score;
                this.highScoreText.text = highScore;
                localStorage.setItem('hiscore', highScore);
            }
            //sets background movement while moving
            if(this.p1Rocket.isMovingL)
            {
                this.background.tilePositionX -= bgSpeed;
            }
            else if(this.p1Rocket.isMovingR)
            {
                this.background.tilePositionX += bgSpeed;
            }
        }

        //check collision of each spaceship and give points
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.sound.play('sfx_explosion');
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.sound.play('sfx_explosion');
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.sound.play('sfx_explosion');
            this.shipExplode(this.ship01);
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }
        if(this.p1Rocket.isFiring && check == 0)
        {
            check = 1;
            this.firing = this.add.text(270, 54, 'Fire', scoreConfig);
        }
        else if(!this.p1Rocket.isFiring && check == 1){
            check = 0;
            this.firing.destroy();
        }
    }

    //check collision method
    checkCollision(rocket, ship){
        if(rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y +ship.height && 
            rocket.height + rocket.y > ship.y){
            return true;
        }
        else{
            return false;
        }
    }
    //have the ships explode and play an animation
    shipExplode(ship){
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
    }
}
