var config = {
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO,
    width: 1800,
    height: 700,
    physics: {
        default: "arcade",
        arcade: {debug: false}
    },
    fps: {
        target: 144,
        forceSetTimeOut: true
    },
    scene: [ homepage, testScene ]
}

var game = new Phaser.Game(config)