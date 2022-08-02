import Phaser, { Physics } from 'phaser'

export default class Player{
	private img: string;
	body? : Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	bullets? : Phaser.Physics.Arcade.Group;
	imgKey: string;
	hp : number;
	constructor(hp_ : number, imgPath : string) {
		this.hp = hp_;
		this.img = imgPath;
		this.imgKey = 'player';
	}
	preload(curScene : Phaser.Scene){
		curScene.load.image(this.imgKey, this.img);
	}
	create(curScene : Phaser.Scene){
		this.body = curScene.physics.add.image(200, 100, this.imgKey);
		this.body.setCollideWorldBounds(true);
		this.bullets = curScene.physics.add.group({
			collideWorldBounds:true,
			velocityY: -100
		});
		curScene.physics.world.on('worldbounds', (body) => {
			const obj = body.gameObject as Phaser.Physics.Arcade.Body;
			obj.destroy();
		});
	}
	update(curScene : Phaser.Scene, time: number, delta: number){
		const cursor = curScene.input.keyboard.createCursorKeys();
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
			const newBullet = this.bullets.create(this.body.body.center.x, this.body.body.center.y + 10,
				'bullet_player') as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
			newBullet.body.onWorldBounds = true;
		}

	}
}
