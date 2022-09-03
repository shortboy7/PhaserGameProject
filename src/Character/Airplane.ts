import Phaser from "phaser";
import {image, side, status} from './type'

export default class Airplane{
	protected curScene : Phaser.Scene;
	private airplaneImg : image;
	_airplane? : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	side : side;
	get airplane() : Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
		if (this._airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this._airplane;
	}
	set airplane(body : Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
		this._airplane = body;
	}

	get status() : status{
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.gameObject.getData('status');
	}
	set status(newStatus : status){
		if (this.airplane == undefined)
			throw Error("set called before aiplane is initialized");
		this.airplane.body.gameObject.setData('status', newStatus);
	}
	get left() : number {
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.left;
	}
	get right():number {
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.right;
	}
	get top():number {
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.top;
	}
	get bottom():number {
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.bottom;
	}
	get center():Phaser.Math.Vector2{
		if (this.airplane == undefined)
			throw Error("get called before aiplane is initialized");
		return this.airplane.body.center;
	}
	constructor(scene : Phaser.Scene, planeImgKey : string, planeImgPath:string,
		side : side) {
		this.curScene = scene;
		this.airplaneImg = {
			key : planeImgKey,
			path: planeImgPath
		};
		this.side = side;
	}
	preload() : void{
		this.curScene.load.image(this.airplaneImg.key, this.airplaneImg.path);
	}
	create(createX : number = 0, createY : number = 0, status : status) : void{
		this.airplane = this.curScene.physics.add.image(createX, createY, this.airplaneImg.key);
		this.airplane.setCollideWorldBounds(true);
		this.airplane.setState(this.side);
		this.airplane.setData('status', status);
	}
	update(time : number, delta : number) : 'gameOver' | 'gameContinue'{
		if (this.airplane == undefined)
			throw Error("update called before aiplane is initialized");
		const cur = this.status;
		if (this.status.hp <= 0)
		{
			this.airplane?.destroy();
			if (this.side != 'enemy')
				return ('gameOver');
		}
		return 'gameContinue';
	}
};
