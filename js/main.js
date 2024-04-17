const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let map;
let groundLayer;
let skyLayer;
let waterLayer;

const game = new Phaser.Game(config);

function preload() {

    this.load.tilemapTiledJSON("map", "tiled/game1.json");

this.load.spritesheet("spritesheet", "tiled/spritesheet.png", { frameWidth: 16, frameHeight: 16 });

    this.load.spritesheet('dude', 'assets/girl.png', { frameWidth: 31, frameHeight: 47 });
}

function create() {

    map = this.make.tilemap({key: "map"});

    const tiles = map.addTilesetImage('spritesheet');

    groundLayer = map.createLayer('ground', tiles, 0, 0);

    groundLayer.setCollisionByExclusion([-1]);

    waterLayer = map.createLayer('water', tiles, 0, 0);

    waterLayer.setCollisionByExclusion([-1]);

    skyLayer = map.createLayer('sky', tiles, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;

    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(groundLayer, player);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);

    ////////////als je water raakt ben je dood
    gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#fff' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    this.physics.add.collider(waterLayer, player, playerHitWater, null, this);


      // Knop voor opnieuw starten
      restartButton = this.add.text(400, 400, 'Restart', { fontSize: '32px', fill: '#fff' });
      restartButton.setOrigin(0.5);
      restartButton.setInteractive();
  
      restartButton.on('pointerdown', restartGame);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-100);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(100);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-200);
    }
}

function playerHitWater() {
    // Handle player's death behavior here
    // For example, reset player position or end the game
    // Here's an example of resetting player position:
    player.setX(100);
    player.setY(450);

       // Toon game over tekst
       gameOverText.setVisible(true);

       // Schakel de speler uit
       player.disableBody(true, true);
}

function restartGame() {
    // Reset het spel
    gameOverText.setVisible(false);
    player.enableBody(true, 100, 450, true, true); // Stel de speler opnieuw in op startpositie
}