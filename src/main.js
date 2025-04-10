const config = {
    type: Phaser.AUTO,//by default webgl or canvas is selected
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

let road;
let player, cursors;
let enemies;
let gameOverFlag = false;
let scoreText;
let score = 0;

function preload(){

    this.load.image("road", "assets/road_800x600.jpg");
    this.load.spritesheet("player", "assets/new_sprite.png",{ frameWidth: 345, frameHeight: 354 });
    this.load.image("enemy1","assets/blackcar_resized.png");
    this.load.image("enemy2", "assets/bluecar_resized_frame.png")

}

function create(){

    road = this.add.tileSprite(400, 300, 800, 600, 'road');
    // this.add.image(400, 300, "road");
    player = this.physics.add.sprite(400, 500, 'player', 1).setScale(0.7);
    player.setCollideWorldBounds(true);

    player.setSize(120, 210);

    this.anims.create({
        key: 'left',
        frames: [{ key: 'player', frame: 0 }],
        frameRate: 10
    });

    this.anims.create({
        key: 'center',
        frames: [{ key: 'player', frame: 1 }], // Corrected frame index
        frameRate: 10
    });

    this.anims.create({
        key: 'right',
        frames: [{ key: 'player', frame: 2 }], // Corrected frame index and key
        frameRate: 10
    });


    player.play('center');

    cursors = this.input.keyboard.createCursorKeys();

    enemies = this.physics.add.group();
    this.time.addEvent({
        delay: 1500,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(player, enemies, gameOver, null, this);

    scoreText = this.add.text(20, 20, "Score: 0",{ fontSize: '20px', fill: '#fff' });

    this.time.addEvent({
        delay: 1000,
        callback: updateScore,
        callbackScope: this,
        loop: true
    });

}

function update(){

    if (gameOverFlag) return;

    road.tilePositionY -= 3;

    if(cursors.left.isDown) 
    {
        player.x -= 3;
        player.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.x += 3;
        player.play('right', true);
    }
    else 
    {
        player.play('center', true)
    }

    enemies.children.iterate(function(enemy){
        if (enemy && enemy.y > 650){
            enemy.destroy();
        }
    });

}

function spawnEnemy(){
    if (enemies.countActive(true) < 3){
            const x = Phaser.Math.Between(250, 550);
    const enemyKey = Phaser.Math.RND.pick(["enemy1", "enemy2"]);
    let enemy = enemies.create(x, -100, enemyKey);

    enemy.setVelocityY(200);
    enemy.setScale(0.8);
    enemy.setDepth(1);

    enemy.setSize(110, 160);

    }
}

function gameOver(){
    gameOverFlag = true;
    this.physics.pause();
    player.setTint(0xff0000);
    this.add.text(150, 250, "GAME OVER", {  fontsize: '50px', fill: '#fff'});
    this.add.text(150, 300, "Your Score: " + score, { fontSize: '40px', fill: '#fff' });
    }

function updateScore(){
    if (!gameOverFlag) {
        score++;
        scoreText.setText("Score: " + score);
    }
}
const game = new Phaser.Game(config);