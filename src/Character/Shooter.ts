import Phaser from "phaser";
import {image} from "./type"

export default class Shooter{
	static bullet_images: image[] = [
		{key:"bullet_enemy", path:"assets/bullet_enemy.png"},
		{key:"bullet_player", path:"assets/bullet_player.png"}
	];
	private _bullets? : Phaser.Physics.Arcade.Group;
	get bullets() : Phaser.Physics.Arcade.Group {
		if (this._bullets == undefined)
			throw Error("get called before bullet is initialized");
		return this._bullets;
	}
	set bullets(bodies : Phaser.Physics.Arcade.Group){
		this._bullets = bodies;
	}
	constructor(
		private scene : Phaser.Scene,
		private bulletImageKey:string,
		private id : string
		)
	{}
	create() : void {
		this.bullets = this.scene.physics.add.group({
			collideWorldBounds : true,
			bounceX:0,
			bounceY:0
		});
	}
	shoot(posX : number, posY : number, vectorX : number, vectorY : number,
		damage : number)
	: void {
		const newBullet = this.bullets.create(
			posX, posY, this.bulletImageKey) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
		newBullet.body.onWorldBounds = true;
		newBullet.setVelocity(vectorX, vectorY);
		newBullet.setData('damage', damage);
		newBullet.setState(this.id);
	}
};
