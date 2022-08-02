import Phaser, { Physics } from 'phaser'
import Player from '../Character/Player'
import Enemy from '../Character/Enemy'

export default class MainGameScene extends Phaser.Scene
{
  player:Player;
  enemies:Enemy;
  constructor()
	{
    super('main-game');
    this.player = new Player(300,'assets/airplane.png');
    this.enemies = new Enemy('assets/airplane.png');
  }

	preload()
  {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bullet_player', 'assets/bullet_player.png');
    this.player.preload(this);
    this.enemies.preload(this);
  }

  create()
  {
    this.add.image(400, 300, 'sky');
    this.player.create(this);
    this.enemies.create(this);
    if (this.player.bullets == undefined || this.enemies.enemies == undefined) return ;
    this.physics.add.collider(this.player.bullets, this.enemies.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.setData('hp', enemy.getData('hp') - 1);
      if (enemy.getData('hp') <= 0)
        enemy.destroy();
    });
  }

  update(time: number, delta: number): void
  {
    this.player.update(this, time, delta);
  }
}
