import Phaser, { Physics } from 'phaser'

export default class Player{
	private curScene: Phaser.Scene;
	private img: string;
	body? : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	bullets? : Phaser.Physics.Arcade.Group;
	imgKey: string;
	hp : number;
	constructor(scene : Phaser.Scene, hp_ : number, imgPath : string) {
		this.curScene = scene;
		this.hp = hp_;
		this.img = imgPath;
		this.imgKey = 'player';
	}
	preload(){
		this.curScene.load.image(this.imgKey, this.img);
	}
	create(){
		this.body = this.curScene.physics.add.image(200, 100, this.imgKey);
		this.body.setCollideWorldBounds(true);
		this.bullets = this.curScene.physics.add.group({

			collideWorldBounds:true,
			velocityY: -100
		});
	}
	update(time: number, delta: number){
		const cursor = this.curScene.input.keyboard.createCursorKeys();
		if (this.body == undefined || this.bullets == undefined)
			return;
		this.body.setVelocity(0, 0);
		if(cursor.left.isDown){
		  this.body.setVelocityX(-100);
		}
		else if(cursor.right.isDown){
		  this.body.setVelocityX(+100);
		}
		if(cursor.down.isDown){
		  this.body.setVelocityY(+100);
		}
		else if(cursor.up.isDown){
		  this.body.setVelocityY(-100);
		}
		if(cursor.space.isDown){
		  this.bullets.create(this.body.body.center.x, this.body.body.center.y + 10, 'bullet_player');
		}
	}
}