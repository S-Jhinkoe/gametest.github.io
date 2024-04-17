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

const game = new Phaser.Game(config);

function preload() {

    this.load.tilemapTiledJSON("map", "tiled/test.json");

this.load.spritesheet("spritesheet", "tiled/spritesheet.png", { frameWidth: 16, frameHeight: 16 });

    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {

    map = this.make.tilemap({key: "map"});

    const tiles = map.addTilesetImage('spritesheet');

    groundLayer = map.createLayer('Ground', tiles, 0, 0);

    groundLayer.setCollisionByExclusion([-1]);

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
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

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