
// Player
var player;
var speed = 500;
var jump = 500;
var gunoffset = 40;

// Stage
var walls;

// Inputs
var input;
var pointer;
var keys;

// Gun
var gun;
var fireRate = 4;
var duration = 1;
var bulletVelocity = 5000;
var angle;

// Scenes
var r1;
var switchScene = false; 

class Bullet extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y) {
        super(scene, x, y, "bullet");
    }

    fire(x, y) {
        this.setBounce(0.3);
        this.setScale(0.02);
        this.body.reset(x, y+7);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX((pointer.x-gun.x)/Math.hypot(pointer.x-gun.x, pointer.y-gun.y)*bulletVelocity+Math.random()*50);
        this.setVelocityY((pointer.y-gun.y-7)/Math.hypot(pointer.x-gun.x, pointer.y-gun.y)*bulletVelocity+Math.random()*50);
        this.setRotation(angle)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    
        if (contains(this.x, this.y, r1)) {
            console.log("hit");
            //r1.setFillStyle(0x6666ff)
            switchScene = true;
        }

        // Out of bounds
        if (this.y <= 0 || this.y >= 700 || this.x <= 0 || this.x >= 1900) {
            this.setActive(false);
            this.setVisible(false);
        }

    }
}

function contains(x, y, rectangle) {
    if (
    x >= rectangle.getTopLeft().x &&
    x <= rectangle.getBottomRight().x &&
    y >= rectangle.getTopRight().y &&
    y <= rectangle.getBottomRight().y) {
        return true;
    }

    return false;
}

class Bullets extends Phaser.Physics.Arcade.Group {

    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Bullet,
            frameQuantity: 100,
            active: false,
            visible: false,
            key: "bullet"
        });
    }

    fireBullet(x, y) {
        const bullet = this.getFirstDead(false);
        if (bullet) {
            bullet.fire(x, y);
        }
    }
}

class homepage extends Phaser.Scene{

    constructor(){
        super("homepage");

        this.bullets;
    }

    preload() {

        this.load.image("background", "assets/background.png");
        this.load.image("player", "assets/celeste.png");
        this.load.image("wall", "assets/block.png");
        this.load.image("gun", "assets/sdmg.png");
        this.load.image("bullet", "assets/bullet.png");

    }

    create(){
            //this.add.text(50,50, "test", {color: "white", fontSize: "42px"});
            this.add.image(800,200,"background");

            // Walls
            walls = this.physics.add.staticGroup();
            walls.create(0,735, "wall").setScale(20,0.2).setDepth(4).refreshBody();
            // walls.create(200,200, "wall").setScale(0.2).refreshBody();
            // walls.create(300,300, "wall").setScale(0.2).refreshBody();
            // walls.create(400,400, "wall").setScale(0.2).refreshBody();
            r1 = this.add.rectangle(200,200,200,200, 0x6666ff)
            r1.setDepth(4);

            // Player
            player = this.physics.add.sprite(1000, 420, "player");
            player.setScale(0.2);
            player.setCollideWorldBounds(true);
            player.setGravityY(2000);
            player.setDepth(0);

            // Gun
            gun = this.physics.add.sprite(1000,420, "gun");
            gun.setDepth(3);
            this.bullets = new Bullets(this);

            // Input
            keys = this.input.keyboard.addKeys("W, A , S , D, , U, SPACE, pointer,");

            // Collision
            this.physics.add.collider(player, walls);
            //this.physics.add.collider(this.bullets, walls);

            // Cursor
            pointer = this.input.activePointer;
    }

    fireBullet() {
        this.bullets.fireBullet(gun.x, gun.y);
    }

    update(){
        if (false) {
            console.log("x:"+pointer.x)
            console.log("y:"+pointer.y)
        }
        // Horizontal Movement
        if (keys.D.isDown) {
            player.setVelocityX(speed);
            player.setFlipX(false);
            gunoffset = 40;
        }   
        else if (keys.A.isDown) {
            player.setVelocityX(-speed);
            player.setFlipX(true);
            gunoffset = -40;
        }
        else {
            player.setVelocityX(0);
        }

        if ((keys.W.isDown || keys.SPACE.isDown) && player.body.touching.down) {
            player.setVelocityY(-jump);
        }

        // Moving gun with player
        gun.setPosition(player.x+gunoffset, player.y+24)
         
        // Checking if the pointer is in the game
        if (pointer.y >= 0 && pointer.y <= 700) {
            // Aiming gun at cursor
            angle = Phaser.Math.Angle.Between(gun.x,gun.y,pointer.x,pointer.y)
            gun.setRotation(angle);
            // Flipping gun sprite when moving between quadrants
            if (angle > -1.55 && angle < 1.55) {
                gun.setFlipY(false);
            }
            else {
                gun.setFlipY(true);
            }

            duration = pointer.getDuration();
      
        // Allows bullets to be fired at a staggered rate while LMB is held down. Also shoots at first click
            if (Math.trunc(duration) % fireRate == 0 && pointer.isDown || duration < 5 && duration > 0){       
                this.fireBullet(gun.x, gun.y);
            }
        }

        if (switchScene) {
            console.log("here");
            switchScene = false;
            //this.scene.start("testScene");
            //aawindow.location.href = "contact.html"
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    }

}

// class testScene extends Phaser.Scene{

//     constructor(){
//         super("testScene");
//     }

//     preload() {

//         this.load.image("background", "assets/background.png");
//         this.load.image("player", "assets/celeste.png");
//         this.load.image("wall", "assets/block.png");
//         this.load.image("gun", "assets/SDMG.png");
//         this.load.image("bullet", "assets/bullet.png");

//     }

//     create(){
//         this.add.image(800,200,"background");
//         this.add.text(400,400,"THIS IS A DIFFERENT SCENE")
//     }
// }
