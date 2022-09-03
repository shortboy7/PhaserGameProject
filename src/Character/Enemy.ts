import Phaser from "phaser";
import Shooter from "./Shooter";
import {image, side, status} from './type'

export default class Enemy
{
	static enemyImage : image[] = [
		{key : 'enemy_1', path: 'assets/airplane_enemy_1.png'} ,
	];
	private _shooter : Shooter;
	public group : Phaser.Physics.Arcade.Group;
	get bullets() : Phaser.Physics.Arcade.Group {
		return this._shooter.bullets;
	}
	// called in scene's preload function
	constructor(
		private scene: Phaser.Scene,
		private enemyKey : string ,
		private status : status
	){
		this.group = this.scene.physics.add.group({
			bounceX : 0,
			bounceY : 0,
			collideWorldBounds : true
		});
		this._shooter = new Shooter(this.scene, 'bullet_enemy', 'enemy_bullet');
	}
	makeEnemy(
		createY : number, createX : number,
		vectorY : number = 0, vectorX : number = 0) : void {
		const newEnemy : Phaser.Types.Physics.Arcade.ImageWithDynamicBody =
		this.group.create(createX, createY, this.enemyKey) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
		newEnemy.setVelocity(vectorX, vectorY);
		newEnemy.setCollideWorldBounds(true);
		newEnemy.setState('enemy');
		newEnemy.setData('status', this.status);
	}
	preload() : void {

	}
	create() : void {
		this._shooter.create();
	}
	update(time:number, delta:number) : void {
		// render with scene flow
		// shoot...
		this.group.children.iterate((enemyObj) => {
			const status : status = enemyObj.getData('status');
			const enemy = enemyObj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
			if (status.nextFire < time) {
				this._shooter.shoot(enemy.getCenter().x, enemy.getBottomCenter().y + 5,
					0, +status.bulletSpeed, status.damage);
				enemyObj.setData('status', {
					...status,
					nextFire: status.nextFire + status.attackSpeed
				});
			}
		});
	}
}
