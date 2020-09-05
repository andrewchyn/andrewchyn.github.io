var config = {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO,
    width: 1900,
    height: 700,
    physics: {
        default: "arcade",
        arcade: {debug: false}
    },
    scene: [ homepage, testScene ]
}

var game = new Phaser.Game(config)