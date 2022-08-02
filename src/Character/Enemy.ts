import Phaser from "phaser";

export default class Enemy{
	private static imgKey = 'enemy'
	private static imgPath : string | undefined;
	enemies? : Phaser.Physics.Arcade.Group;
	fireInterval : number;
	nextFire : number;
	constructor (imgPath : string) {
		Enemy.imgPath = imgPath;
		this.fireInterval = 500;
		this.nextFire = 0;
	}
	private makeEnemy(x : number, y : number) : void {
		if (this.enemies == undefined)
			return ;
		const newEnemy = this.enemies.create(x, y, Enemy.imgKey) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
		newEnemy.body.gameObject.setData('hp', 5);
	}
	preload(curScene : Phaser.Scene)
	{
		curScene.load.image(Enemy.imgKey, Enemy.imgPath);
	}
	create(curScene : Phaser.Scene)
	{
		this.enemies = curScene.physics.add.group({
			collideWorldBounds : true,
			bounceX: 0,
			bounceY: 0
		});
		this.makeEnemy(100, 100);
		this.makeEnemy(120, 100);
	}
	update(time : number, delta : number)
	{
		if (time < this.nextFire) return ;

	}
};
