//Name: Saif Kausar
//Points earned:
// All Starting Tier options done:
// High Score, Fire UI, BG music, Speed increase, Random Direction, new BG, Rocket Control
// Novice Tier:
// Displayed Time
// New Title Screen
// Basic Parallax Scrolling
// Others:
// changed main sprite
// changed ship sprite
// Couldn't quite figure out animations

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu,Play],

};
//create main game object
let game = new Phaser.Game(config); 

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000
}

let keyF, keyLEFT, keyRIGHT;
let highScore;