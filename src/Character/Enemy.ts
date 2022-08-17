import Phaser from "phaser";
import Alarm from './../../../../../ReactProject/third_study_assignment/src/Alarm';

type EnemyState = {
	hp : number,
	fireInterval : number,
	nextFire : number
};

export default class Enemy{
	private static imgKey = 'enemy'
	private static imgPath : string | undefined;
	enemies? : Phaser.Physics.Arcade.Group;
	bullets? : Phaser.Physics.Arcade.Group;

	constructor (imgPath : string) {
		Enemy.imgPath = imgPath;
	}

	private makeEnemy(x : number, y : number, vx : number | undefined = undefined, vy : number | undefined = undefined) : void {
		if (this.enemies == undefined)
			return ;
		const newEnemy = this.enemies.create(x, y, Enemy.imgKey) as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
		if (vx != undefined && vy != undefined)
			newEnemy.body.setVelocity(vx, vy);
		newEnemy.body.gameObject.setData('status',{
			hp:1,
			fireInterval : Phaser.Math.Between(700, 800),
			nextFire : 0
		});
		newEnemy.setState('enemy');
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
		this.bullets = curScene.physics.add.group({
			velocityY: 100
		});
		this.makeEnemy(100, 100);
		this.makeEnemy(200, 100);
		this.makeEnemy(300, 100);
		curScene.physics.world.on('worldbounds', (body) => {
			const obj = body.gameObject as Phaser.Physics.Arcade.Body;
			obj.destroy();
		});
	}

	update(curScene : Phaser.Scene, time : number, delta : number)
	{
		if (this.enemies == undefined || this.bullets == undefined) return;
		this.enemies.children.iterate((enemy_c) => {
			const enemyState = enemy_c.getData('status') as EnemyState;
			const enemy = enemy_c as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
			if (enemyState.nextFire > time) return ;
			const newBullet = this.bullets?.create(enemy.body.center.x, enemy.body.center.y + 5, 'bullet_player') as
			Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
			newBullet.setCollideWorldBounds(true);
			newBullet.body.onWorldBounds = true;
			enemy.setData('status', {
				...enemyState,
				nextFire : enemyState.nextFire + enemyState.fireInterval
			});
			newBullet.setState('enemy_bullet');
		});
	}
};
