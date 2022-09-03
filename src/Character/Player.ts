import Phaser from "phaser";
import {image, side, status} from './type'
import Airplane from './Airplane';
import Shooter from './Shooter';

export default class Player extends Airplane{
	private _shooter : Shooter;
	private cursor : Phaser.Types.Input.Keyboard.CursorKeys;
	public class_status : status;
	get bullets() : Phaser.Physics.Arcade.Group {
		return this._shooter.bullets;
	}
	constructor(
		scene : Phaser.Scene,
		planeImgKey : string, planeImgPath:string,
		bulletImageKey:string, bulletImagePath : string,
		status : status
	)
	{
		super(scene, planeImgKey, planeImgPath, 'player');
		this._shooter = new Shooter(scene, bulletImageKey, 'player_bullet');
		this.cursor = this.curScene.input.keyboard.createCursorKeys();
		this.class_status = status;
	}
	private shootNormal() : void
	{
		this._shooter.shoot(
			this.center.x, this.bottom - 5,
			0, this.status.bulletSpeed * (-1),
			this.status.damage
		);
	}

	create(createX : number, createY : number) : void {
		super.create(createX, createY, this.class_status);
		this._shooter.create();
	}

	update(time : number, delta : number) : 'gameOver' | 'gameContinue'
	{
		let result = super.update(time, delta);
		if (result == 'gameOver')
		{
			this.curScene.scene.start('MenuScene');
			return result;
		}
		this.airplane.body.setVelocity(0, 0);
		if (this.cursor.left.isDown){
			this.airplane.body.setVelocityX(-100);
		}
		else if (this.cursor.right.isDown){
			this.airplane.body.setVelocityX(+100);
		}
		if (this.cursor.down.isDown){
			this.airplane.body.setVelocityY(+100);
		}
		else if (this.cursor.up.isDown){
			this.airplane.body.setVelocityY(-100);
		}
		if (this.cursor.space.isDown){
			if (this.status.nextFire < time)
			{
				this.shootNormal();
				this.status = {
					...this.status ,
					nextFire : this.status.attackSpeed + time
				};
			}
		}
		return (result);
	}
};
