import Phaser, { Physics } from 'phaser'
import Player from '../Character/Player'
import Enemy from '../Character/Enemy'
import Boss from '~/Character/Boss';

export default class MainGameScene extends Phaser.Scene
{
  player?:Player;
  enemies:Enemy;
  boss?:Boss;
  constructor()
	{
    super('main-game');
    this.enemies = new Enemy('assets/airplane.png');
    this.boss = new Boss('assets/Boss1.png');
  }

	preload()
  {
    this.player = new Player(this, 300,'assets/airplane.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bullet_player', 'assets/bullet_player.png');

    this.player.preload(this);
    this.enemies.preload(this);
    this.boss?.preload(this);
  }

  create()
  {
    this.add.image(400, 300, 'sky');
    this.player?.create(this);
    this.enemies.create(this);
    // this.boss?.create(this);

    if (this.player == undefined || this.enemies == undefined
      || this.enemies.bullets == undefined || this.player.body == undefined) return ;
    if (this.player.bullets == undefined || this.enemies.enemies == undefined) return ;
    this.physics.add.collider(this.player.bullets, this.enemies.enemies, (bullet, enemy) => {
      enemy.body.velocity.x -= bullet.body.velocity.x;
      enemy.body.velocity.y -= bullet.body.velocity.y;
      bullet.destroy();
      const status = enemy.getData('status');
      if (status.hp <= 1)
        enemy.destroy();
      enemy.setData('status', {
        ...status,
        hp : status.hp - 1
      });
    });
    this.physics.add.collider(this.enemies.bullets, this.player.body, (one, two) => {
      if (one == undefined || two == undefined) return;
      let player :  Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      let bullet : Phaser.Types.Physics.Arcade.GameObjectWithBody;
      if (one.state == 'player')
        player = one as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      else
        player = two as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      if (one.state == 'enemy_bullet')
        bullet = one as Phaser.Types.Physics.Arcade.GameObjectWithBody;
      else
        bullet = two as Phaser.Types.Physics.Arcade.GameObjectWithBody;
      const status = player.getData('status');
      player.body.velocity.x -= bullet.body.velocity.x;
      player.body.velocity.y -= bullet.body.velocity.y;
      bullet.destroy();
      player.setData('status', {
        hp : status.hp - 1
      });
    });
    if (this.boss?.bullets != undefined)

  }

  update(time: number, delta: number): void
  {
    if (this.player?.body?.getData('status').hp <= 0)
      this.scene.pause();
    if (this.enemies?.enemies?.getChildren().length == 0 && this.boss?.boss == undefined)
    {
      if (this.player != undefined && this.player.bullets != undefined){
        this.boss?.create(this);
        if (this.boss != undefined && this.boss.boss != undefined && this.boss.bullets != undefined &&
          this.player.body != undefined){
          this.physics.add.collider(this.player.bullets, this.boss.boss, (one, two) => {
            if (one == undefined || two == undefined) return;
            let enemy :  Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            let bullet : Phaser.Types.Physics.Arcade.GameObjectWithBody;
            if (one.state == 'enemy')
              enemy = one as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            else
              enemy = two as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            if (one.state == 'player_bullet')
              bullet = one as Phaser.Types.Physics.Arcade.GameObjectWithBody;
            else
              bullet = two as Phaser.Types.Physics.Arcade.GameObjectWithBody;


          enemy.body.velocity.x -= bullet.body.velocity.x;
          enemy.body.velocity.y -= bullet.body.velocity.y;
          bullet.destroy();
          const status = enemy.getData('status');
            enemy.setData('status', {
              ...status,
              hp : status.hp - 1
            });
          });
          this.physics.add.collider(this.boss?.bullets, this.player.body, (one, two) => {
            if (one == undefined || two == undefined) return;
            let player :  Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            let bullet : Phaser.Types.Physics.Arcade.GameObjectWithBody;
            if (one.state == 'player')
              player = one as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            else
              player = two as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
            if (one.state == 'enemy_bullet')
              bullet = one as Phaser.Types.Physics.Arcade.GameObjectWithBody;
            else
              bullet = two as Phaser.Types.Physics.Arcade.GameObjectWithBody;
            const status = player.getData('status');
            player.body.velocity.x -= bullet.body.velocity.x;
            player.body.velocity.y -= bullet.body.velocity.y;
            bullet.destroy();
            player.setData('status', {
              hp : status.hp - 1
            });
          });
        }
      }
    }
    this.player?.update(this, time, delta);
    this.enemies?.update(this, time, delta);
    this.boss?.update(this, time, delta);
  }
}
