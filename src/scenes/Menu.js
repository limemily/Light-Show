class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.audio('sfx_twinkle', './assets/twinkle.mp3');
        this.load.audio('sfx_explosion', './assets/firework_explosion.mp3');
        this.load.audio('sfx_rocket', './assets/firework_launch.mp3');
        this.load.audio('music', './assets/Fortnite Theme(cover).wav');
    }
    create() {
        //menu display
        let menuConfig = {
            fontFamily: 'Verdana',
            fontSize: '20px',
            backgroundColor: '#0258C1',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY- textSpacer, 'LIGHT SHOW', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use <--> Arrows to move & F to Shoot Fireworks', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#134076';
        menuConfig.color = '#FFFFFF';
        this.add.text(centerX, centerY + textSpacer, 'Press <- for Easy or -> for Hard', menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('music');
          this.sound.play('sfx_twinkle');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('music');
          this.sound.play('sfx_twinkle');
          this.scene.start("playScene");    
        }
    }
    //this.scene.start("playScene");
}