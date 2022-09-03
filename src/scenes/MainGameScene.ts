import Phaser, { Physics } from 'phaser'
import Collision from '~/Character/Collision';
import Player from '../Character/Player'
import Enemy from '../Character/Enemy'
import Boss from '~/Character/Boss';
import Shooter from '~/Character/Shooter';
import {image, side, status} from '../Character/type';

export default class MainGameScene extends Phaser.Scene
{
  private player?:Player;
  private enemy? : Enemy;
  private boss?:Boss;
  constructor()
	{
    console.log('constructor called');
    super('MainGameScene');
  }

	preload()
  {
    console.log('preload is called');
    Shooter.bullet_images.forEach((img) => {
      this.load.image(img.key, img.path);
    });
    Enemy.enemyImage.forEach((img) => {
      this.load.image(img.key, img.path);
    });
    this.player = new Player(this,
      'player','assets/airplane.png',
      'bullet_player', 'assets/bullet_player.png', {
        hp:300,
        attackSpeed : 500,
        nextFire : 0,
        moveSpeed : 100,
        bulletSpeed : 200,
        damage : 5
      });
    this.enemy = new Enemy(this,
      'enemy_1', {
        hp: 1,
        attackSpeed : 500,
        bulletSpeed : 200,
        nextFire : 30,
        moveSpeed : 100,
        damage : 3
      });
    this.boss = new Boss(
      this, 'boss', 'assets/Boss1.png',
      {
        hp : 30,
        attackSpeed : 1000,
        bulletSpeed : 200,
        nextFire : 1000,
        moveSpeed : 100,
        damage : 5
      }
    );
    this.player.preload();
    this.boss.preload();
    this.load.image('sky', 'assets/sky.png');
  }

  create()
  {
    console.log('create called');
    this.add.image(400, 300, 'sky');
    this.player?.create(200,300);
    this.enemy?.create();
    this.enemy?.makeEnemy(100, 100);
    this.enemy?.makeEnemy(100, 200);
    this.enemy?.makeEnemy(100, 300);
    if (this.player == undefined || this.enemy == undefined) return ;
    Collision.bulletAndPlane(this, this.player.bullets, this.enemy.group,
      'player_bullet', 'enemy');
    Collision.bulletAndPlane(this, this.enemy.bullets, this.player.airplane,
      'enemy_bullet', 'player');
    this.physics.world.on('worldbounds', (body) => {
      const obj = body.gameObject as Phaser.Physics.Arcade.Body;
      obj.destroy();
    });
  }

  update(time: number, delta: number): void
  {
    if (!this.game.hasFocus) {
      this.scene.pause();
      this.add.text(200, 200, 'resume').setOrigin(0.5,0.5)
      .setInteractive({ useHandCursor: true })
		  .on('pointerdown', () => {
        console.log('clicked');
			  this.scene.resume();
		  })
    }
    if (this.player == undefined || this.enemy == undefined) return ;
    this.player.update(time, delta);
    this.enemy.update(time, delta);
    if (this.enemy.group.children.size == 0)
    {
      if (this.boss == undefined) return ;
      if (this.boss._airplane == undefined) {
        this.boss.create(200, 100);
        Collision.bulletAndPlane(this, this.boss.bullets, this.player.airplane,
          'enemy_bullet', 'player');
        Collision.bulletAndPlane(this, this.player.bullets, this.boss.airplane,
          'player_bullet', 'boss');
      }
      this.boss.update(time, delta);
    }
  }
}
