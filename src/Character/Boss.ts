import Phaser from 'phaser'
import MenuScene from '~/scenes/MenuScene'
import Airplane from './Airplane';
import {status} from './type';
import Shooter from '~/Character/Shooter';

export default class Boss extends Airplane{
	private _shooter: Shooter;
	private class_status : status;
	private razorOn : number = -1;
	private razorOff : number = 0;
	get bullets() : Phaser.Physics.Arcade.Group {
		return this._shooter.bullets;
	}
	constructor(
		scene:Phaser.Scene,
		planeImgKey : string, planeImgPath:string,
		status : status
	) {
		super(scene, planeImgKey, planeImgPath, 'boss');
		this._shooter = new Shooter(scene, 'bullet_enemy', 'enemy_bullet');
		this.class_status = status;
	}
	private shotlines(lines : number = 8) : void {
		for (let y = this.bottom; y >= this.bottom - 10 ; y -= 5) {
			for (let x = this.left; x < this.right ; x += (this.right - this.left) / lines) {
				if (x == this.left || x == this.right - 1) continue;
				this._shooter.shoot(x, y + 10, 0, this.status.bulletSpeed, this.status.damage);
			}
		}
	}
	private shotRound(ways : number = 8, radius : number = 50) : void {
		for (let i = 0 ; i < ways ; i++) {
			const [cos, sin] = [Math.cos(2 * i * Math.PI / ways), Math.sin(2 * i * Math.PI / ways)];
			this._shooter.shoot(
				this.center.x + radius * cos,
				this.center.y + radius * sin,
				this.status.bulletSpeed * cos,
				this.status.bulletSpeed * sin,
				this.status.damage
			);
		}
	}
	private shotRazor(time : number, duration : number = 3000) : void {
		this.razorOn = time;
		this.razorOff = time + duration;
	}
	private continueRazor(time : number, ways : number = 4) : void {
		const l = this.left, r = this.right;
		const b = this.bottom;
		const convertTime = Math.floor(6000 / ways);
		let i = Math.floor((time - this.razorOn) / convertTime) + 1;
		const step = (r - l) / (ways + 2);
		this._shooter.shoot(l + step * i, b, 0,
			+this.status.attackSpeed, this.status.damage);
		this._shooter.shoot(r - step * i, b, 0,
			+this.status.attackSpeed, this.status.damage);
		if (time > this.razorOff) this.razorOn = -1;
	}
	private doPattern(time : number) : void {
		const id = (Phaser.Math.RND.integer() % 10);
		if (0 <= id && id <= 4)
			this.shotlines();
		else if (5 <= id && id <= 8)
			this.shotRound();
		else
			this.shotRazor(time);
	}
	create(createX : number, createY : number) : void {
		super.create(createX, createY, this.class_status);
		this.airplane.setScale(4);
		this._shooter.create();
	}
	update(time : number, delta : number) : 'gameOver' | 'gameContinue'
	{
		let result = super.update(time, delta);
		if (result == 'gameOver')
		{
			this.curScene.scene.start('MenuScene');
			return (result);
		}
		if (this.razorOn >= 0) {
			this.continueRazor(time);
		}
		else if (this.status.nextFire < time) {
			this.doPattern(time);
			this.status = {
				...this.status,
				nextFire: this.status.nextFire + this.status.attackSpeed
			};
		}
		return (result);
	}
}
