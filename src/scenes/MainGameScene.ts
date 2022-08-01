import Phaser, { Physics } from 'phaser'
import Player from '../Character/Player'
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
  player:Player;
  player_bullets?:Phaser.Physics.Arcade.Group;
  constructor()
	{
    super('main-game');
    this.player = new Player(this, 300,'assets/airplane.png');
	}

	preload()
  {
    this.load.image('sky', 'assets/sky.png');
    this.player.preload();
    this.load.image('bullet_player', 'assets/bullet_player.png');
  }

  create()
  {
    this.add.image(400, 300, 'sky');
    this.player.create();
  }

  update(time: number, delta: number): void
  {
    this.player.update(time, delta);
  }
}
