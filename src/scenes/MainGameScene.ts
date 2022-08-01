import Phaser, { Physics } from 'phaser'

class PlayerObject{
  private movespeed_local:number = 100;
  private attackspeed_local:number = 1;
  get attackspeed() : number{
    return this.attackspeed_local;
  }
  set attackspeed(as : number) {
    this.attackspeed_local = as;
  }
  get movespeed() : number {
    return this.movespeed_local;
  }
  set movespeed(ms : number) {
    this.movespeed_local = ms;
  }
};

export default class MainGameScene extends Phaser.Scene
{
  player?:Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  player_bullets?:Phaser.Physics.Arcade.Group;
  constructor()
	{
    super('main-game');
	}

	preload()
  {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('airplane', 'assets/airplane.png');
    this.load.image('bullet_player', 'assets/bullet_player.png');
  }

  create()
  {
    this.add.image(400, 300, 'sky');
    this.player = this.physics.add.image(200, 100, 'airplane');
    this.player.setCollideWorldBounds(true);
    this.player_bullets = this.physics.add.group({
        velocityY : -100
    });
  }

  update(time: number, delta: number): void
  {
    const cursor = this.input.keyboard.createCursorKeys();
    this.player?.setVelocity(0, 0);
    if(cursor.left.isDown){
      this.player?.setVelocityX(-100);
    }
    else if(cursor.right.isDown){
      this.player?.setVelocityX(+100);
    }
    if(cursor.down.isDown){
      this.player?.setVelocityY(+100);
    }
    else if(cursor.up.isDown){
      this.player?.setVelocityY(-100);
    }
    if(cursor.space.isDown){
      this.player_bullets?.create(this.player?.body.center.x, this.player?.body.center.y + 10, 'bullet_player');
    }
  }
}
