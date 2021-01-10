class testScene extends Phaser.Scene{

    constructor(){
        super("testScene");
    }

    preload() {

        this.load.image("background", "assets/background.png");
        this.load.image("player", "assets/celeste.png");
        this.load.image("wall", "assets/block.png");
        this.load.image("gun", "assets/SDMG.png");
        this.load.image("bullet", "assets/bullet.png");

    }

    create(){
        this.add.image(800,200,"background");
        this.add.text(400,400,"THIS IS A DIFFERENT SCENE")
    }
}