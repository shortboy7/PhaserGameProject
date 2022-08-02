import Phaser from "phaser";

export default class Enemy{
	private static imgKey = 'enemy'
	private static imgPath : string | undefined;
	enemies? : Phaser.Physics.Arcade.Group;
	constructor (imgPath : string) {
		Enemy.imgPath = imgPath;
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
			collideWorldBounds : true
		});
		this.makeEnemy(100, 10);
		this.makeEnemy(120, 10);
	}
	update()
	{

	}
};
