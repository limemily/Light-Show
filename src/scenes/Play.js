class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/launch.png');
        this.load.image('spaceship', './assets/target.png');
        this.load.image('starfield', './assets/nightsky.png');
        this.load.image('hill', './assets/hill.png');
        this.load.image('tree', './assets/tree.png');
        this.load.image('cloud', './assets/cloud score.png');
        this.load.spritesheet('explosion', './assets/fireworks.png', {frameWidth: 250, frameHeight: 250, startFrame: 0, endFrame: 7});
    }
    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // white rectangle borders
        this.tree = this.add.tileSprite(350, 200, 640, 480, 'tree').setScale(0.7, 0.7).setOrigin(0, 0);
        this.tree = this.add.tileSprite(-230, 200, 640, 480, 'tree').setScale(0.7, 0.7).setOrigin(0, 0);
        this.hill = this.add.tileSprite(0, 420, 640, 100, 'hill').setOrigin(0, 0);  
        //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
       // this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.cloud = this.add.tileSprite(37, 42, 400, 50, 'cloud').setScale(1.4, 1.4).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setScale(0.5, 0.5).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setScale(0.5, 0.5).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setScale(0.5, 0.5).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7, first: 0}),
            frameRate: 7
        });
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Verdana',
            fontSize: '20px',
            backgroundColor: '#0258C1',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        // game over flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        this.add.text(game.config.width/2, game.config.height/2, 'Beautiful!', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press F for Menu or <- for Restart', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        }, null, this);
    }
    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }
    
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x - 100, ship.y - 100, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');     
    }
}