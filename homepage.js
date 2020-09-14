
// Player
var player;
var speed = 500;
var jump = false;
var jumpCancel = false;
var gunoffset = 40;
var highJump = 700;
var lowJump = 200;
var climbRate = 100;
var climbDecayMax = 5;
var climbDecay = 5;
// Stage
var walls;
var breakables;

// Inputs
var input;
var pointer;
var keys;

// Gun
var gun;
var fireRate = 5;
var duration = 1;
var bulletVelocity = 6000;
var angle;
var keepShooting = true;

// Sword
var swung = false;
var dashHeight = 1000;

// Scenes
var r1;
var r2;
var switchScene = false; 

class Bullet extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y) {
        super(scene, x, y, "bullet");
    }

    fire(x, y) {
        this.body.setCircle(1);
        this.setBounce(1);
        this.setScale(0.02);
        this.setSize(0.2,0.2)
        this.body.reset(x, y+7);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX((pointer.x-gun.x)/Math.hypot(pointer.x-gun.x, pointer.y-gun.y)*bulletVelocity+Math.random()*5);
        this.setVelocityY((pointer.y-gun.y-7)/Math.hypot(pointer.x-gun.x, pointer.y-gun.y)*bulletVelocity+Math.random()*5);
        this.setRotation(angle)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    
        if (contains(this.x, this.y, r1)) {
            console.log("hit");
            //r1.setFillStyle(0x6666ff)
            this.setActive(false);
            this.setVisible(false);
            switchScene = true;
            keepShooting = false;
            this.setActive(false);
            this.setVisible(false);
        }
        // if (checkBreakables(this.x, this.y)) {
        //     console.log("yep")
        // }

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

// function checkBreakables(x, y) {
//     for (wall in breakables.getChildren()) {
//         if (
//             x >= wall.getTopLeft().x &&
//             x <= wall.getBottomRight().x &&
//             y >= wall.getTopRight().y &&
//             y <= wall.getBottomRight().y) {
//             return true;
//             }
//     }
//     return false;
// }

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
        this.load.image("player", "assets/player.png");
        this.load.image("wall", "assets/block.png");
        this.load.image("gun", "assets/sdmg.png");
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("black", "assets/black.png")

    }

    create(){
            //this.add.text(50,50, "test", {color: "white", fontSize: "42px"});
            this.add.image(config.width/2,config.height/2,"background");

            // Walls
            walls = this.physics.add.staticGroup();
            // Floor and Ceiling
            walls.create(0,735, "wall").setScale(20,0.2).setDepth(4).refreshBody();
            walls.create(0,-35, "wall").setScale(20,0.2).setDepth(4).refreshBody();

            walls.create(300,140, "wall").setScale(0.1,1).refreshBody();
            walls.create(1000,620, "wall").setScale(0.2).refreshBody();
            walls.create(1200,400, "wall").setScale(0.2).refreshBody();
            // walls.create(400,400, "wall").setScale(0.2).refreshBody();

            // Breakables
            breakables = this.physics.add.staticGroup();
            breakables.create(100,300, "black").setScale(1,0.2).refreshBody();

            //test button
            r1 = this.add.rectangle(700,550,200,200, 0xeb34d5);
            r1.setDepth(4);


            // Player
            player = this.physics.add.sprite(100, 500, "player");
            player.setScale(0.2).refreshBody().setSize(350,750).setOffset(200,100);
            player.setCollideWorldBounds(true);
            player.setGravityY(2000);
            player.setDepth(0);

            // Gun
            gun = this.physics.add.image(1000,420, "gun");
            gun.setDepth(3);
            this.bullets = new Bullets(this);

            // Input
            keys = this.input.keyboard.addKeys("W, A , S , D, , U, SPACE, pointer, SHIFT");

            // Collision
            this.physics.add.collider(player, walls);
            this.physics.add.collider(this.bullets, walls);
            this.physics.add.collider(player, breakables);
            // this.physics.add.collider(player, this.bullets);
        

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

        // Wall Climb
        if (player.body.touching.right || player.body.touching.left) {
            if (keys.SHIFT.isDown) {
                player.setVelocityY(0);
            }
            else {
                player.setVelocityY(climbRate);
            }
            climbDecay = climbDecayMax;
        }

        console.log(climbDecay)
        // Horizontal Movement
        if (keys.D.isDown) {
            player.setVelocityX(speed);
            player.setFlipX(false).setSize(350,750).setOffset(200,100);
            gunoffset = 40;
        }   
        else if (keys.A.isDown) {
            player.setVelocityX(-speed);
            player.setFlipX(true).setSize(350,750).setOffset(100,100);
            gunoffset = -40;
        }
        else {
            player.setVelocityX(0);
        }

       // Crouch
       if (keys.S.isDown) {

       }

       // Sword 
       if (pointer.rightButtonDown() && !swung) {
           // Swing to the right
           swung = true;
           if (!player.body.touching.down) {
               dashHeight = 400
           }

           else {
               dashHeight = 2000
           }

            if (pointer.x > player.x) {
                player.setVelocityX(1000)
                player.setVelocityY(-dashHeight)
            }

            else {
                player.setVelocityX(-1000)
                player.setVelocityY(-dashHeight)
           }
       }

       if (player.body.touching.down) {
           swung = false;
       }



        // Jumping
        if (keys.SPACE.isDown && (player.body.touching.right || player.body.touching.left || player.body.touching.down || climbDecay > 0)) {
            jump = true;
            console.log("jump = "+jump)
        }
        
        else if (keys.SPACE.isUp && (!player.body.touching.right && !player.body.touching.left && !player.body.touching.down)){ jumpCancel = true;
            console.log("jumpCancel = "+jumpCancel)
        }

        if (jump) {
            player.setVelocityY(-highJump);
            jump = false;
        }

        if (jumpCancel) {
            // if player is still going up (negative Y vel)
            console.log("yvel:"+player.body.velocity.y)
            if (player.body.velocity.y <= -lowJump) {
                player.setVelocityY(-lowJump);
            }
            jumpCancel = false;
        }
        
        // Moving gun with player
        gun.setPosition(player.x+gunoffset, player.y+24)
         
        // Checking if the pointer is in the game
        if (pointer.y >= 0 && pointer.y <= 700 && keepShooting) {
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
            if (Math.trunc(duration) % fireRate == 0 && pointer.leftButtonDown() || duration < 2 && duration > 0){       
                this.fireBullet(gun.x, gun.y);
            }
        }

        if (switchScene) {
            console.log("here");
            switchScene = false;
            //this.scene.start("testScene");
            //aawindow.location.href = "contact.html"
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }

        if (climbDecay > 0) {
            climbDecay -= 1;
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
